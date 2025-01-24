import { supabase } from "../../config/supabaseClient.js"
import XLSX from "xlsx"

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
                        SPRid_FK
                    ),
                    Devis!Devis_EB_fk_fkey (
                        ND,
                        devis_date,
                        montant,
                        expiration_date,
                        reception_date
                    ),
                    Paiements!Paiements_EB_fk_fkey (
                        no_commande,
                        no_virement,
                        nom_acteur,
                        libelle_du_virement,
                        paiement_partiel,
                        montant,
                        reglement_date
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
                        edle_reel
                    ),
                    MES!MES_EB_fk_fkey (
                        no_PDL,
                        status_consuel,
                        consuel_remise,
                        MES_demande,
                        MES_reel,
                        MES_prev
                    ),
                    Facture!Facture_EB_fk_fkey (
                        no_fac,
                        montant_ht,
                        montant_ttc,
                        facture_date
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

        const drFilesExist = await checkFilesExistWithoutId("demrac", item.Site?.EB)
        const devisFilesExist = await checkFilesExistWithoutId("devis", item.Site?.EB)
        const paiementsFilesExist = await checkFilesExistWithoutId("paie", item.Site?.EB)
        const factureFilesExist = await checkFilesExistWithoutId("facture", item.Site?.EB)

        return {
          "EB": item.Site?.EB || "NULL",
          "G2R": item.Site?.G2R || "NULL",
          "Nom site": item.Site?.nom || "NULL",
          "Region": item.Site?.region || "NULL",
          "Status Site SFR": item.Site?.status_site_SFR || "NULL",
          "Programme": programData?.PR_desc || "NULL",
          "Operateurs": item.Site?.Operateurs?.join(", ") || "NULL",
          "Zone": item.Site?.zone || "NULL",
          "Nom prospect": item.nom || "NULL",
          "Longitude": item.longitude || "NULL",
          "Latitude": item.latitude || "NULL",
          "Status validation": statusValData?.SV_desc || "NULL",
          "Retenu": item.retenu ? "Oui" : "Non",
          "Recipisee depot DP": item.Site?.DP?.[0]?.recipisse_depot_DP || "NULL",
          "ANO certificat tacite": item.Site?.DP?.[0]?.ANO_certificat_tacite || "NULL",
          "Arrete opposition": item.Site?.DP?.[0]?.arrete_opposition || "NULL",
          "Status GO travaux prev": item.Site?.DP?.[0]?.status_go_traveauxP || "NULL",
          "Status GO travaux reel": item.Site?.DP?.[0]?.status_go_traveauxR || "NULL",
          "Num Demande Raccordement": item.Site?.DR?.[0]?.NDRid || "NULL",
          "Ko DP": item.Site?.DR?.[0]?.Ko_Dp || "NULL",
          "Date DR": item.Site?.DR?.[0]?.date_dr || "NULL",
          "Type Raccordement": item.Site?.DR?.[0]?.type_rac || "NULL",
          "Gestionnaire reseau": entiteData?.nom || "NULL",
          "Status Proposition": sprData?.SPR_desc || "NULL",
          "Numero Devis": item.Site?.Devis?.[0]?.ND || "NULL",
          "Devis date": item.Site?.Devis?.[0]?.devis_date || "NULL",
          "Montant": item.Site?.Devis?.[0]?.montant || "NULL",
          "Expiration date": item.Site?.Devis?.[0]?.expiration_date || "NULL",
          "Reception date": item.Site?.Devis?.[0]?.reception_date || "NULL",
          "No commande": item.Site?.Paiements?.[0]?.no_commande || "NULL",
          "No virement": item.Site?.Paiements?.[0]?.no_virement || "NULL",
          "Nom acteur": item.Site?.Paiements?.[0]?.nom_acteur || "NULL",
          "Libelle virement": item.Site?.Paiements?.[0]?.libelle_du_virement || "NULL",
          "Paiement partiel": item.Site?.Paiements?.[0]?.paiement_partiel || "NULL",
          "Paiement montant": item.Site?.Paiements?.[0]?.montant || "NULL",
          "Reglement date": item.Site?.Paiements?.[0]?.reglement_date || "NULL",
          "No Traveaux": item.Site?.Traveaux?.[0]?.Tid || "NULL",
          "Fin GC prev": item.Site?.Traveaux?.[0]?.fin_gc_prev || "NULL",
          "Fin GC reel": item.Site?.Traveaux?.[0]?.fin_gc_reel || "NULL",
          "Levee pylone prev": item.Site?.Traveaux?.[0]?.levee_pylone_prev || "NULL",
          "Levee pylone reel": item.Site?.Traveaux?.[0]?.levee_pylone_reel || "NULL",
          "Extension prev": item.Site?.Traveaux?.[0]?.extension_prev || "NULL",
          "Extension reel": item.Site?.Traveaux?.[0]?.extension_reel || "NULL",
          "Branchement prev": item.Site?.Traveaux?.[0]?.branchement_prev || "NULL",
          "Branchement reel": item.Site?.Traveaux?.[0]?.branchement_reel || "NULL",
          "EDLE prev": item.Site?.Traveaux?.[0]?.edle_prev || "NULL",
          "EDLE reel": item.Site?.Traveaux?.[0]?.edle_reel || "NULL",
          "No PDL": item.Site?.MES?.[0]?.no_PDL || "NULL",
          "Status consuel": item.Site?.MES?.[0]?.status_consuel || "NULL",
          "Consuel remise": item.Site?.MES?.[0]?.consuel_remise || "NULL",
          "MES demande": item.Site?.MES?.[0]?.MES_demande || "NULL",
          "MES reel": item.Site?.MES?.[0]?.MES_reel || "NULL",
          "MES prev": item.Site?.MES?.[0]?.MES_prev || "NULL",
          "No facture": item.Site?.Facture?.[0]?.no_fac || "NULL",
          "Montant HT": item.Site?.Facture?.[0]?.montant_ht || "NULL",
          "Montant TTC": item.Site?.Facture?.[0]?.montant_ttc || "NULL",
          "Facture date": item.Site?.Facture?.[0]?.facture_date || "NULL",
          "DR PJ": drFilesExist ? "Oui" : "Non",
          "Devis PJ": devisFilesExist ? "Oui" : "Non",
          "Paiements PJ": paiementsFilesExist ? "Oui" : "Non",
          "Facture PJ": factureFilesExist ? "Oui" : "Non",
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
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Reporting Data")
  const fileBuffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" })
  return fileBuffer
}
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
        .from('reports') // Specify the correct bucket
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

