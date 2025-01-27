import { supabase } from "../../config/supabaseClient.js"
import XLSX from "xlsx"
import moment from "moment"
const checkFilesExistWithoutId = async (component, Sid) => {
  try {
    const folderPath = `${component}-pdf/${Sid}`
    const { data, error } = await supabase.storage.from(component + "-pdf").list(folderPath)
    if (error) {
      console.error(`Error checking files for ${component}:`, error)
      return false
    }
    return data && data.length > 0
  } catch (error) {
    console.error(`Error in checkFilesExistWithoutId for ${component}:`, error)
    return false
  }
}
const formatDate = (date) => {
    if (!date) return "";
    return moment(date).format("DD/MM/YYYY HH:mm");
  };
const getReportingData = async () => {
  try {
    console.log("Fetching data from Prospect...")
    const { data, error } = await supabase
      .from("Prospect")
      .select(`
                nom,
                longitude,
                latitude,
                status_validation_fk,
                retenu,
                commentaires,
                Site:Prospect_EB_fk_fkey (
                    EB,
                    G2R,
                    nom,
                    region,
                    status_site_SFR,
                    programme_fk,
                    Operateurs,
                    zone,
                    DP (
                        recipisse_depot_DP,
                        ANO_certificat_tacite,
                        arrete_opposition,
                        status_go_traveauxP,
                        status_go_traveauxR
                    ),
                    DR!DR_EB_fk_fkey (
                        NDRid,
                        Ko_Dp,
                        date_dr,
                        type_rac,
                        gestionnaire_de_reseau,
                        SPRid_FK,
                        fin_trav_prev,
                        commentaires
                    ),
                    Devis!Devis_EB_fk_fkey (
                        ND,
                        devis_date,
                        montant,
                        expiration_date,
                        reception_date,
                        fournisseur,
                        type_devis,
                        commentaires
                    ),
                    Paiements!Paiements_EB_fk_fkey (
                        no_commande,
                        no_virement,
                        nom_acteur,
                        libelle_du_virement,
                        paiement_partiel,
                        montant,
                        reglement_date,
                        commentaires
                    ),
                    Traveaux!Travaux_EB_fk_fkey (
                        Tid,
                        fin_gc_prev,
                        fin_gc_reel,
                        levee_pylone_prev,
                        levee_pylone_reel,
                        extension_prev,
                        extension_reel,
                        branchement_prev,
                        branchement_reel,
                        edle_prev,
                        edle_reel,
                        commentaires
                    ),
                    MES!MES_EB_fk_fkey (
                        no_PDL,
                        status_consuel,
                        consuel_remise,
                        MES_demande,
                        MES_reel,
                        MES_prev,
                        commentaires
                    ),
                    Facture!Facture_EB_fk_fkey (
                        no_fac,
                        montant_ht,
                        montant_ttc,
                        facture_date,
                        tva,
                        commentaires,
                        Dfk
                    )
                )
            `)
      .eq("is_active", true)

    if (error) {
      console.error("Error fetching data from Prospect:", error)
      return { success: false, error: "Failed to fetch Prospect data" }
    }

    console.log("Fetched data from Prospect:", data)

    if (!data || data.length === 0) {
      console.warn("No prospect data found for the given criteria")
      return { success: false, error: "No prospect data found" }
    }

    const reportingDataWithMappedValues = await Promise.all(
      data.map(async (item) => {
        console.log("Processing item:", item)

        const programData = await fetchRelatedData("Programme", "PR_desc", "PRid", item.Site?.programme_fk)
        const entiteData = await fetchRelatedData("Entite", "nom", "Eid", item.Site?.DR?.[0]?.gestionnaire_de_reseau)
        const sprData = await fetchRelatedData("SPR", "SPR_desc", "SPRid", item.Site?.DR?.[0]?.SPRid_FK)
        const statusValData = await fetchRelatedData("Status-validation", "SV_desc", "SVid", item.status_validation_fk)
        const frnsEntite = await fetchRelatedData("Entite", "nom", "Eid", item.Site?.Devis?.[0]?.fournisseur)
        const drFilesExist = await checkFilesExistWithoutId("demrac", item.Site?.EB)
        const devisFilesExist = await checkFilesExistWithoutId("devis", item.Site?.EB)
        const paiementsFilesExist = await checkFilesExistWithoutId("paie", item.Site?.EB)
        const factureFilesExist = await checkFilesExistWithoutId("facture", item.Site?.EB)

        return {
          "0001.EB": item.Site?.EB || "",
          "0002.G2R": item.Site?.G2R || "",
          "0003.Nom site": item.Site?.nom || "",
          "0004.Region": item.Site?.region || "",
          "0005.Status Site SFR": item.Site?.status_site_SFR || "",
          "0006.Programme": programData?.PR_desc || "",
          "0007.Operateurs": item.Site?.Operateurs?.join(", ") || "",
          "0008.Zone": item.Site?.zone || "",
          "0009.Nom prospect": item.nom || "",
          "0010.Prospect_Longitude": item.longitude || "",
          "0011.Prospect_Latitude": item.latitude || "",
          "0012.Prospect_Status validation": statusValData?.SV_desc || "",
          "0013.Prospect_Retenu": item.retenu ? "Oui" : "Non",
          "0014.Prospect_Commentaires": item.commentaires || "",
          "0015.DP_Recipisee depot DP": formatDate(item.Site?.DP?.[0]?.recipisse_depot_DP || ""),
          "0016.DP_ANO certificat tacite": formatDate(item.Site?.DP?.[0]?.ANO_certificat_tacite || ""),
          "0017.DP_Arrete opposition": formatDate(item.Site?.DP?.[0]?.arrete_opposition || ""),
          "0018.DP_Status GO travaux prev": formatDate(item.Site?.DP?.[0]?.status_go_traveauxP || ""),
          "0019.DP_Status GO travaux reel": formatDate(item.Site?.DP?.[0]?.status_go_traveauxR || ""),
          "0020.Num Demande Raccordement": item.Site?.DR?.[0]?.NDRid || "",
          "0021.DR_fin trav prev": formatDate(item.Site?.DR?.[0]?.fin_trav_prev || ""),
          "0022.DR_Ko DP": formatDate(item.Site?.DR?.[0]?.Ko_Dp || ""),
          "0023.Date DR": formatDate(item.Site?.DR?.[0]?.date_dr || ""),
          "0024.DR_Type Raccordement": item.Site?.DR?.[0]?.type_rac || "",
          "0025.DR_Gestionnaire reseau": entiteData?.nom || "",
          "0026.DR_Status Proposition": sprData?.SPR_desc || "",
          "0027.DR PJ": drFilesExist ? "Oui" : "Non",
          "0028.DR_Commentaires": item.Site?.DR?.[0]?.commentaires || "",
          "0029.Numero Devis": item.Site?.Devis?.[0]?.ND || "",
          "0030.Devis Fournisseur": frnsEntite?.nom || "",
          "0031.Type Devis": item.Site?.Devis?.[0]?.type_devis || "",
          "0032.Devis date": formatDate(item.Site?.Devis?.[0]?.devis_date || ""),
          "0033.Devis_Montant TTC": item.Site?.Devis?.[0]?.montant || "",
          "0034.Devis_Expiration date": formatDate(item.Site?.Devis?.[0]?.expiration_date || ""),
          "0035.Devis_Reception date": formatDate(item.Site?.Devis?.[0]?.reception_date || ""),
          "0036.Devis PJ": devisFilesExist ? "Oui" : "Non",
          "0037.Devis_Commentaires": item.Site?.Devis?.[0]?.commentaires || "",
          "0038.Reglement_No commande": item.Site?.Paiements?.[0]?.no_commande || "",
          "0039.Reglement_No virement": item.Site?.Paiements?.[0]?.no_virement || "",
          "0040.Regelemnt_Nom acteur": item.Site?.Paiements?.[0]?.nom_acteur || "",
          "0041.Reglement_Libelle virement": item.Site?.Paiements?.[0]?.libelle_du_virement || "",
          "0042.Reglement_Paiement partiel": item.Site?.Paiements?.[0]?.paiement_partiel || "",
          "0043.Paiement montant": item.Site?.Paiements?.[0]?.montant || "",
          "0044.Reglement date": formatDate(item.Site?.Paiements?.[0]?.reglement_date || ""),
          "0045.Paiements PJ": paiementsFilesExist ? "Oui" : "Non",
          "0037.Paiements_Commentaires": item.Site?.Paiements?.[0]?.commentaires || "",
          "0047.No Traveaux": item.Site?.Traveaux?.[0]?.Tid || "",
          "0048.Traveaux_Fin GC prev": formatDate(item.Site?.Traveaux?.[0]?.fin_gc_prev || ""),
          "0049.Traveaux_Fin GC reel": formatDate(item.Site?.Traveaux?.[0]?.fin_gc_reel || ""),
          "0050.Levee pylone prev": formatDate(item.Site?.Traveaux?.[0]?.levee_pylone_prev || ""),
          "0051.Levee pylone reel": formatDate(item.Site?.Traveaux?.[0]?.levee_pylone_reel || ""),
          "0052.Extension prev": formatDate(item.Site?.Traveaux?.[0]?.extension_prev || ""),
          "0053.Extension reel": formatDate(item.Site?.Traveaux?.[0]?.extension_reel || ""),
          "0054.Branchement prev": formatDate(item.Site?.Traveaux?.[0]?.branchement_prev || ""),
          "0055.Branchement reel": formatDate(item.Site?.Traveaux?.[0]?.branchement_reel || ""),
          "0056.EDLE prev": formatDate(item.Site?.Traveaux?.[0]?.edle_prev || ""),
          "0057.EDLE reel": formatDate(item.Site?.Traveaux?.[0]?.edle_reel || ""),
          "0058.Traveaux_Commentaires": item.Site?.Traveaux?.[0]?.commentaires || "",
          "0059.MES_No PDL": item.Site?.MES?.[0]?.no_PDL || "",
          "0060.Status consuel": item.Site?.MES?.[0]?.status_consuel || "",
          "0061.Consuel remise": formatDate(item.Site?.MES?.[0]?.consuel_remise || ""),
          "0062.MES demande": formatDate(item.Site?.MES?.[0]?.MES_demande || ""),
          "0063.MES prev": formatDate(item.Site?.MES?.[0]?.MES_prev || ""),
          "0064.MES reel": formatDate(item.Site?.MES?.[0]?.MES_reel || ""),
          "0065.MES_Commentaires": item.Site?.MES?.[0]?.commentaires || "",
          "0066.No facture": item.Site?.Facture?.[0]?.no_fac || "",
          "0067.Facture_Montant HT": item.Site?.Facture?.[0]?.montant_ht || "",
          "0068.Facture_Montant TTC": item.Site?.Facture?.[0]?.montant_ttc || "",
          "0069.Facture TVA": item.Site?.Facture?.[0]?.tva || "",
          "0070.Facture No Devis": item.Site?.Facture?.[0]?.Dfk || "",
          "0071.Facture date": formatDate(item.Site?.Facture?.[0]?.facture_date || ""),
          "0072.Facture PJ": factureFilesExist ? "Oui" : "Non",
          "0073.facture_Commentaires": item.Site?.Facture?.[0]?.commentaires || "",
        }
      }),
    )
    return { success: true, data: reportingDataWithMappedValues }
  } catch (error) {
    console.error("Unexpected error:", error)
    return { success: false, error: error.message }
  }
}
const fetchRelatedData = async (table, column, idColumn, id) => {
  if (!id) return null
  const { data, error } = await supabase.from(table).select(column).eq(idColumn, id).single()

  if (error) {
    console.error(`Error fetching ${table} data:`, error)
    return null
  }
  return data
}
const generateExcelFile = (data) => {
    try {
        // Create a worksheet from the data
        const ws = XLSX.utils.json_to_sheet(data);

        // Create a new workbook and append the worksheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Reporting Data");

        // Write the workbook to a buffer with explicit encoding and compression
        const fileBuffer = XLSX.write(wb, {
            bookType: 'xlsx',       // Specify the file type
            type: 'buffer',         // Generate a Node.js buffer
            compression: true,      // Enable compression to reduce file size
        });

        console.log("Excel file generated successfully");
        return fileBuffer;
    } catch (error) {
        console.error("Error generating Excel file:", error);
        throw error; // Rethrow the error for higher-level handling
    }
};
const downloadExcel = async (filePath) => {
    try {
      console.log('Attempting to download file from path:', filePath);
  
      // Sanitize file path
      const sanitizedFilePath = filePath.startsWith('reports/')
        ? filePath.replace('reports/', '')
        : filePath;
  
      console.log('Sanitized file path:', sanitizedFilePath);
  
      // Fetch the file from the Supabase storage bucket
      const { data, error } = await supabase.storage
        .from('reports')
        .download(sanitizedFilePath);
  
      if (error) {
        console.error('Error downloading file:', error);
        return null;
      }
  
      console.log('File downloaded successfully');
      return data;
    } catch (error) {
      console.error('Error in downloadExcel:', error);
      throw error;
    }
  };
const ReportingGlobalModel = {
  getReportingData,
  generateExcelFile,
  downloadExcel,
}
export default ReportingGlobalModel

