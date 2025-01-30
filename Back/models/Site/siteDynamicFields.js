import { supabase } from "../../config/supabaseClient.js";

// Get retenu of porpsect (dynamic field )
const getPropsectretenu  = async (Sid) => {
  const { data, error } = await supabase
    .from('Prospect')
    .select('retenu')
    .eq('is_active', true)
    .eq('EB_fk',Sid)
    .eq('status_validation_fk',25);
  if (error) {
    console.error('Supabase Error Details:', error);
    throw error;
  }
  return data;
};
// Get date demande de raccordement (dynamic field )
const getDrDate = async (EB_fk) => {
  const { data, error } = await supabase
      .from('DR')
      .select(`
          date_dr, 
          Prospect(status_validation_fk)
      `) 
      .eq('EB_fk', EB_fk) 
      .eq('Prospect.status_validation_fk', 25);

  if (error) {
      console.error('Supabase Error Details (getDrDate):', error);
      return { success: false, error: 'Error fetching DR date.' };
  }

  // Filter out null dates
  const validDates = data.filter((record) => record.date_dr !== null);
  if (validDates.length > 0) {
      return { success: true, data: validDates[0].date_dr };
  } else {
      return { success: false, error: 'No valid DR dates found.' };
  }
};
// Get devis reception date ( dynamic field )
const getDevisRecDate = async (Sid) => {
  const { data, error } = await supabase
    .from('Devis')
    .select('reception_date, DR(is_active, Prospect(status_validation_fk))')
    .eq('EB_fk', Sid)
    .eq('DR.is_active', true)
    .eq('DR.Prospect.status_validation_fk', 25);

  if (error || data.length === 0) {
    return { success: false, data: 'N/A' };
  }

  const validDates = data.filter((record) => record.reception_date !== null);
  return validDates.length > 0
    ? { success: true, data: validDates[0].reception_date }
    : { success: false, data: 'N/A' };
};
// Get reglement date (dynamic field)
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
      const validDates = data.filter((record) => record.reglement_date !== null);
    if (validDates.length > 0) {
        return { success: true, data: validDates[0].reglement_date };
    } else {
        return { success: false, error: 'No valid Devis dates found.' };
    }
  } catch (error) {
    console.error('Error in getReglementDate:', error.message);
    throw new Error('An error occurred while fetching reglement date.');
  }
};
// Get MES REEL (dynamic field)
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