import { supabase } from "../../config/supabaseClient.js";
// Add a contact to a site
const addSiteContact = async (Sid, Cid) => {
    const { data, error } = await supabase
      .from('Site-contact')
      .insert([{ Sid, Cid }]); // Use the exact column names
  
    if (error) {
      throw error; // Throw the error for debugging
    }
  
    return data;
  };
// Delete a contact from a site 
const deleteSiteContact = async (Sid, Cid) => {
    const response  = await supabase
      .from('Site-contact')
      .delete()
      .eq('Sid', Sid)
      .eq('Cid', Cid);
    if (response.error) {
      throw error; // Ensure the error is properly thrown
    }
    return response; // Return the result to the controller
  };
  // Get site contacts
const getSiteConatcts = async (Sid) => {
    const {data , error } = await supabase
    .from('Site-contact')
    .select(`Contacts(Cid,nom)`)
    .eq('Sid',Sid);
    if(error){  
        throw error;
    }
    return {success:true , data};
};
// Display contact colunms for a site 
const displayContactsSite = async (Sid) => {
    const {data , error } = await supabase
    .from('Site-contact')
    .select(`Cid,
        Contact:Contacts(nom,prenom,email,tel,mobile,mission)`)
    .eq('Sid',Sid);
    if(error){  
        throw error;
    }
    return {success:true , data};
};
const siteContactModel = {
    addSiteContact,
    deleteSiteContact,
    getSiteConatcts,
    displayContactsSite,
};
export default siteContactModel ; 