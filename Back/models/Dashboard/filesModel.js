import { supabase } from '../../config/supabaseClient.js';
import XLSX from 'xlsx';

const getDrDataWithSite = async () => {
    try {
        // Get the data with the join on Site table
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

        return { success: true, data };
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
    generateExcelFile,
}
export default DashFiles;
