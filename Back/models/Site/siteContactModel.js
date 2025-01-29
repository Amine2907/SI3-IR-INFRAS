import { supabase } from "../../config/supabaseClient.js";
// Add a contact to a site
const addExisitngSiteContact = async (Sid, Cid) => {
  const { data, error } = await supabase
    .from('Site-contact')
    .insert([{ Sid, Cid }])
    .select('*');
  if (error) {
    console.error('Supabase Error Details:', error);
    throw error;
  }
  console.log('Returned Data:', data);
  return data;
};
const addNewContactSite = async (Sid, contactData) => {
  try {
    // Insert the new contact
    const { data: contact, error: contactError } = await supabase
      .from('Contacts')
      .insert([contactData])
      .select();
    if (contactError) {
      throw contactError;
    }
    // Extract the new contact ID
    const Cid = contact[0].Cid;
    // Associate the new contact with the site
    const { data: siteContact, error: siteContactError } = await supabase
      .from('Site-contact')
      .insert([{ Sid, Cid }]);

    if (siteContactError) {
      throw siteContactError;
    }
    // Return both contact and site contact data
    return { contact: contact[0], siteContact };
  } catch (error) {
    console.error('Error in addNewContactSite:', error.message);
    throw error;
  }
};
// Delete a contact from a site 
const deleteSiteContact = async (Sid, Cid) => {
    const response  = await supabase
      .from('Site-contact')
      .delete()
      .eq('Sid', Sid)
      .eq('Cid', Cid);
    if (response.error) {
      throw error; 
    }
    return response;
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
        Contact:Contacts(*)`)
    .eq('Sid',Sid);
    if(error){  
        throw error;
    }
    return {success:true , data};
};
const siteContactModel = {
    addNewContactSite,
    addExisitngSiteContact,
    deleteSiteContact,
    getSiteConatcts,
    displayContactsSite,
};
export default siteContactModel ; 