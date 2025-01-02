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
const getDevisRecDate = async (Sid) => {
    const { data, error } = await supabase
      .from('Devis')
      .select('reception_date')
      .eq('is_active', true)
      .eq('EB_fk', Sid);
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
        console.error('Supabase Error Details:', error); // Log detailed error
        throw error;
      }
      console.log('Returned Data:', data); // Log the returned data
      return data; // Make sure data is properly returned
};
const getReglementDate = async (Sid) => {
    const { data, error } = await supabase
      .from('Paiements')
      .select('reglement_date')
      .eq('is_active', true)
      .eq('EB_fk', Sid);
      if (error) {
        console.error('Supabase Error Details:', error); // Log detailed error
        throw error;
      }
      console.log('Returned Data:', data); // Log the returned data
      return data; // Make sure data is properly returned
};
const getMesReel = async (Sid) => {
    const { data, error } = await supabase
      .from('MES')
      .select('MES_reel')
      .eq('is_active', true)
      .eq('EB_fk', Sid);
      if (error) {
        console.error('Supabase Error Details:', error); // Log detailed error
        throw error;
      }
      console.log('Returned Data:', data); // Log the returned data
      return data; // Make sure data is properly returned
};
const siteDynFieldsModel = {
    getPropsectretenu,
    getDevisRecDate,
    getDrDate,
    getReglementDate,
    getMesReel,
};
export default siteDynFieldsModel ; 