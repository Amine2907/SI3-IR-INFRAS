import { supabase } from '../../config/supabaseClient.js';
import XLSX from 'xlsx';

const getReportingData = async () => {
    try {
        console.log('Fetched data from Prospect:', data);
        // Fetch DR data and Site-related fields
        const { data, error } = await supabase
        .from('Prospect')
        .select(`
          nom, 
          longitude, 
          latitude, 
          status_validaton_fk, 
          retenu,
          Site:EB_fk (
            EB, 
            G2R, 
            nom AS site_nom, 
            region, 
            status_site_SFR, 
            programme_fk, 
            operateurs, 
            zone
          ),
          DP:EB_fk (
            recipisee_depot_DP,
            ANO_certificat_tacite,
            arrete_opposition,
            status_go_traveaux_prev,
            status_go_traveaux_reel
          ),
          DR:EB_fk (
            NDRid,
            Ko_DP,
            date_dr,
            type_rac,
            gestionnaire_de_reseau,
            SPRid_fk
          ),
          Devis:EB_fk (
            ND,
            devis_date,
            montant,
            expiration_date,
            reception_date
          ),
          Paiements:EB_fk (
            no_commande,
            no_virement,
            nom_acteur,
            libelle_du_virement,
            paiement_partiel,
            montant AS paiement_montant,
            reglement_date
          ),
          Traveaux:EB_fk (
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
          MES:EB_fk (
            no_PDL,
            status_consuel,
            consuel_remise,
            MES_demande,
            MES_reel,
            MES_prev
          ),
          Facture:EB_fk (
            no_fac,
            montant_ht,
            montant_ttc,
            facture_date
          )
        `)
        .eq('is_active', true);
        if (error) throw error;
        if (prospectError) {
            console.error('Error fetching prospect data:', prospectError);
            return { success: false, error: 'Failed to fetch prospect data' };
        }
        // If no data is returned, handle it gracefully
        if (!prospectData || prospectData.length === 0) {
            console.warn('No prospect data found for the given criteria');
            return { success: false, error: 'No prospect data found' };
        }
        // Map the gestionnaire_de_reseau to the Entite table (Eid to nom)
        const reportingDataWithMappedValues = await Promise.all(data.map(async (item) => {
            const { data: programData, error: programError } = await supabase
            .from('Programme')
            .select('PR_desc')
            .eq('PRid', item.programme_fk)
            .single(); // We expect only one result for each gestionnaire_de_reseau value
        if (programError) {
            console.error('Error fetching Entite:', programError);
        }
            // Fetch the corresponding 'nom' from 'Entite' where Eid matches gestionnaire_de_reseau
            const { data: entiteData, error: entiteError } = await supabase
                .from('Entite')
                .select('nom')
                .eq('Eid', item.gestionnaire_de_reseau)
                .single(); // We expect only one result for each gestionnaire_de_reseau value

            if (entiteError) {
                console.error('Error fetching Entite:', entiteError);
            }
            // Fetch the corresponding 'SPR_desc' from 'SPR' table where SPRid matches SPRid_FK
            const { data: sprData, error: sprError } = await supabase
                .from('SPR')
                .select('SPR_desc')
                .eq('SPRid', item.SPRid_FK)
                .single();
            if (sprError) {
                console.error('Error fetching SPR:', sprError);
            }
            const { data: statusValData, error: svError } = await supabase
            .from('Status-validation')
            .select('Sv_desc')
            .eq('SVid', item.status_validaton_fk)
            .single();
        if (svError) {
            console.error('Error fetching SPR:', svError);
        }
            // Return the mapped data, with NULL handling
            return {
                'EB': item.Site?.EB || 'NULL', 
                'G2R': item.Site?.G2R || 'NULL',
                'Nom site': item.Site?.site_nom || 'NULL',
                'Region': item.Site?.region || 'NULL',
                'Status Site SFR': item.Site?.status_site_SFR || 'NULL',
                'Programme': programData?.PR_desc || 'NULL',
                'Operateurs': item.Site?.operateurs || 'NULL',
                'Zone': item.Site?.zone || 'NULL',
                'Nom prospect': item.nom || 'NULL',
                'Longitude': item.longitude || 'NULL',
                'Latitude': item.latitude || 'NULL',
                'Status validation': statusValData?.Sv_desc || 'NULL',
                'Retenu': item.retenu || 'NULL',
                'Recipisee depot DP': item.DP?.recipisee_depot_DP || 'NULL',
                'ANO certificat tacite': item.DP?.ANO_certificat_tacite || 'NULL',
                'Arrete opposition': item.DP?.arrete_opposition || 'NULL',
                'Status GO travaux prev': item.DP?.status_go_traveaux_prev || 'NULL',
                'Status GO travaux reel': item.DP?.status_go_traveaux_reel || 'NULL',
                'Num Demande Raccordement': item.DR?.NDRid || 'NULL',
                'Ko DP': item.DR?.Ko_DP || 'NULL',
                'Date DR': item.DR?.date_dr || 'NULL',
                'Type Raccordement': item.DR?.type_rac || 'NULL',
                'Gestionnaire reseau': entiteData?.nom || 'NULL',
                'SPR_desc': sprData?.SPR_desc || 'NULL',
                'Numero Devis': item.Devis?.ND || 'NULL',
                'Devis date': item.Devis?.devis_date || 'NULL',
                'Montant': item.Devis?.montant || 'NULL',
                'Expiration date': item.Devis?.expiration_date || 'NULL',
                'Reception date': item.Devis?.reception_date || 'NULL',
                'No commande': item.Paiements?.no_commande || 'NULL',
                'No virement': item.Paiements?.no_virement || 'NULL',
                'Nom acteur': item.Paiements?.nom_acteur || 'NULL',
                'Libelle virement': item.Paiements?.libelle_du_virement || 'NULL',
                'Paiement partiel': item.Paiements?.paiement_partiel || 'NULL',
                'Paiement montant': item.Paiements?.paiement_montant || 'NULL',
                'Reglement date': item.Paiements?.reglement_date || 'NULL',
                'No Traveaux': item.Traveaux?.Tid || 'NULL',
                'Fin GC prev': item.Traveaux?.fin_gc_prev || 'NULL',
                'Fin GC reel': item.Traveaux?.fin_gc_reel || 'NULL',
                'Levee pylone prev': item.Traveaux?.levee_pylone_prev || 'NULL',
                'Levee pylone reel': item.Traveaux?.levee_pylone_reel || 'NULL',
                'Extension prev': item.Traveaux?.extension_prev || 'NULL',
                'Extension reel': item.Traveaux?.extension_reel || 'NULL',
                'Branchement prev': item.Traveaux?.branchement_prev || 'NULL',
                'Branchement reel': item.Traveaux?.branchement_reel || 'NULL',
                'EDLE prev': item.Traveaux?.edle_prev || 'NULL',
                'EDLE reel': item.Traveaux?.edle_reel || 'NULL',
                'No PDL': item.MES?.no_PDL || 'NULL',
                'Status consuel': item.MES?.status_consuel || 'NULL',
                'Consuel remise': item.MES?.consuel_remise || 'NULL',
                'MES demande': item.MES?.MES_demande || 'NULL',
                'MES reel': item.MES?.MES_reel || 'NULL',
                'MES prev': item.MES?.MES_prev || 'NULL',
                'No facture': item.Facture?.no_fac || 'NULL',
                'Montant HT': item.Facture?.montant_ht || 'NULL',
                'Montant TTC': item.Facture?.montant_ttc || 'NULL',
                'Facture date': item.Facture?.facture_date || 'NULL',
            };
        }));
        return { success: true, data: reportingDataWithMappedValues };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
// Function to generate an Excel file from the data
const generateExcelFile = (data) => {
    // Generate a worksheet from the data
    const ws = XLSX.utils.json_to_sheet(data);
    // Create a new workbook and append the worksheet to it
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'DR Data');
    // Generate an Excel file buffer
    const fileBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
    return fileBuffer;
};
const ReportingGlobalModel = {
    getReportingData,
    generateExcelFile,
}
export default ReportingGlobalModel;
