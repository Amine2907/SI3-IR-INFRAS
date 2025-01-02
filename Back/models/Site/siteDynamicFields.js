import { supabase } from "../../config/supabaseClient.js";

const getPropsectretenu  = async (Sid) => {
  const { data, error } = await supabase
    .from('Prospect')
    .select('retenu')
    .eq('is_active', true)
    .eq('EB_fk',Sid);
  if (error) {
    console.error('Supabase Error Details:', error); // Log detailed error
    throw error;
  }
  console.log('Returned Data:', data); // Log the returned data
  return data; // Make sure data is properly returned
};
const getDrDate = async (Sid) => {
    const { data, error } = await supabase
      .from('DR')
      .select('date_dr')
      .eq('is_active', true)
      .eq('EB_fk', Sid);
    if (error) {
        console.error('Supabase Error Details (getDrDate):', error);
        return { success: false, error: 'Error fetching DR date.' };
    }

    const validDates = data.filter((record) => record.date_dr !== null);
    if (validDates.length > 0) {
        return { success: true, data: validDates[0].date_dr };
    } else {
        return { success: false, error: 'No valid DR dates found.' };
    }
};
  const getDevisRecDate = async (Sid) => {
    try {
      const { data, error } = await supabase
        .from('Devis')
        .select('reception_date')
        .eq('is_active', true)
        .eq('EB_fk', Sid);
  
      if (error) {
        console.error('Supabase Error Details (getDevisRecDate):', error);
        throw error;
      }
  
      if (!data || data.length === 0 || !data[0].reception_date) {
        console.warn(`No valid Devis reception date found for Sid: ${Sid}`);
        return null;
      }
  
      console.log('Returned Data (getDevisRecDate):', data);
      return data[0].reception_date;
    } catch (error) {
      console.error('Error in getDevisRecDate:', error.message);
      throw new Error('An error occurred while fetching Devis reception date.');
    }
  };
  
  const getReglementDate = async (Sid) => {
    try {
      const { data, error } = await supabase
        .from('Paiements')
        .select('reglement_date')
        .eq('is_active', true)
        .eq('EB_fk', Sid);
  
      if (error) {
        console.error('Supabase Error Details (getReglementDate):', error);
        throw error;
      }
  
      // Filter out null values
      const validDates = data.filter((record) => record.reglement_date !== null);
  
      if (validDates.length === 0) {
        console.warn(`No valid reglement dates found for Sid: ${Sid}`);
        return null;
      }
  
      console.log('Returned Data (getReglementDate):', validDates);
      return validDates[0].reglement_date; // Return the first valid date
    } catch (error) {
      console.error('Error in getReglementDate:', error.message);
      throw new Error('An error occurred while fetching reglement date.');
    }
  };
  
  const getMesReel = async (Sid) => {
    const { data, error } = await supabase
      .from('MES')
      .select('MES_reel')
      .eq('is_active', true)
      .eq('EB_fk', Sid);
    if (error) {
        console.error('Supabase Error Details (getMesReel):', error);
        return { success: false, error: 'Error fetching MES reel date.' };
    }

    const validDates = data.filter((record) => record.MES_reel !== null);
    if (validDates.length > 0) {
        return { success: true, data: validDates[0].MES_reel };
    } else {
        return { success: false, error: 'No valid MES reel dates found.' };
    }
};
  
const siteDynFieldsModel = {
    getPropsectretenu,
    getDevisRecDate,
    getDrDate,
    getReglementDate,
    getMesReel,
};
export default siteDynFieldsModel ; 