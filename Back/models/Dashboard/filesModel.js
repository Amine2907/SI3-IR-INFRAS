import { supabase } from '../../config/supabaseClient.js';
import XLSX from 'xlsx';

const getDrDataWithSite = async () => {
    try {
        // Fetch DR data and Site-related fields
        const { data, error } = await supabase
            .from('DR')
            .select(`
                NDRid,
                Ko_Dp,
                date_dr,
                type_rac,
                gestionnaire_de_reseau,
                SPRid_FK,
                Site:EB_fk (
                    EB,
                    G2R,
                    nom
                )
            `)
            .eq('is_active', true);

        if (error) throw error;

        // Map the gestionnaire_de_reseau to the Entite table (Eid to nom)
        const drDataWithMappedValues = await Promise.all(data.map(async (item) => {
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
            // Return the mapped data, with NULL handling
            return {
                EB: item.Site ? item.Site.EB : 'NULL', 
                G2R: item.Site ? item.Site.G2R : 'NULL',
                nom: item.Site ? item.Site.nom : 'NULL',
                NDRid: item.NDRid,
                Ko_Dp: item.Ko_Dp || 'NULL',
                date_dr: item.date_dr || 'NULL',
                type_rac: item.type_rac || 'NULL',
                gestionnaire_de_reseau_nom: entiteData ? entiteData.nom : 'NULL',
                SPR_desc: sprData ? sprData.SPR_desc : 'NULL',
            };
        }));
        return { success: true, data: drDataWithMappedValues };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
const getDeviRecuWithSite = async () => {
    try {
        // Fetch DR data and Site-related fields
        const { data, error } = await supabase
            .from('Devis')
            .select(`
                ND,
                fournisseur,
                type_devis,
                devis_date,
                montant,
                expiration_date,
                reception_date,
                Site:EB_fk (
                    EB,
                    G2R,
                    nom
                )
            `)
            .eq('is_active', true)
            .not('reception_date', 'is', null);

        if (error) throw error;

        // Map the gestionnaire_de_reseau to the Entite table (Eid to nom)
        const devisRecuWithMappedValues = await Promise.all(data.map(async (item) => {
            // Fetch the corresponding 'nom' from 'Entite' where Eid matches gestionnaire_de_reseau
            const { data: entiteData, error: entiteError } = await supabase
                .from('Entite')
                .select('nom')
                .eq('Eid', item.fournisseur)
                .single(); // We expect only one result for each gestionnaire_de_reseau value

            if (entiteError) {
                console.error('Error fetching Entite:', entiteError);
            }
            // Return the mapped data, with NULL handling
            return {
                EB: item.Site ? item.Site.EB : 'NULL', 
                G2R: item.Site ? item.Site.G2R : 'NULL',
                nom: item.Site ? item.Site.nom : 'NULL',
                ND: item.ND,
                fournisseur: entiteData ? entiteData.nom : 'NULL',
                type_devis: item.type_devis || 'NULL',
                devis_date: item.devis_date || 'NULL',
                montant: item.montant || 'NULL',
                expiration_date: item.expiration_date || 'NULL',
                reception_date: item.reception_date || 'NULL',
            };
        }));
        return { success: true, data: devisRecuWithMappedValues };
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
const DashFiles = {
    getDrDataWithSite,
    getDeviRecuWithSite,
    generateExcelFile,
}
export default DashFiles;
