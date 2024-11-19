import siteContactModel from "../../models/Site/siteContactModel.js";
// Add a contact to a site controller
const addContactSite = async (req, res) => {
    const { Sid, Cid } = req.body;
    // Validate input
    if (!Sid || !Cid) {
      return res.status(400).json({ error: 'Sid and Cid are required' });
    }
    try {
      const data = await siteContactModel.addSiteContact(Sid, Cid);
      return res.status(201).json({
        message: 'Contact successfully associated with site',
        data,
      });
    } catch (error) {
      console.error('Error associating contact with site:', error);
      return res.status(500).json({ error: 'An error occurred while associating contact with site' });
    }
  };
  // delete a contact from a site controller 
  const deleteContactSite = async (req, res) => {
    const { Sid, Cid } = req.body;
    if (!Sid || !Cid) {
      return res.status(400).json({ error: 'Sid and Cid are required' });
    }
    try {
      const result = await siteContactModel.deleteSiteContact(Sid, Cid);
      if (!result || result.length === 0) {
        return res.status(404).json({ error: 'No association found to delete' });
      }
      return res.status(200).json({
        message: 'Contact deleted from site successfully',
        data: result,
      });
    } catch (error) {
      console.error('Error deleting contact from site:', error.message);
      return res.status(500).json({ error: 'An error occurred while deleting contact from site' });
    }
  };
  // get site contacts 
  const getSiteContacts = async (req, res) => {
    const Sid = req.params.Sid;
    try {
      const contacts = await siteContactModel.getSiteConatcts(Sid);
  
      if (!contacts || contacts.length === 0) {
        return res.status(404).json({ message: 'No contacts found for this site' });
      }
      return res.status(200).json({ contacts });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to fetch site contacts' });
    }
  };
  const displayContactsSite = async (req, res) => {
    const Sid = req.params.Sid.replace(':', '');
      try {
        const result = await siteContactModel.displayContactsSite(Sid);
        if (!result.success) {
          return res.status(400).json({ error: result.error });
        }
        return res.status(200).json(result.data);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch site contacts' });
      }
  };
const siteContactCntrl = {
    addContactSite,
    deleteContactSite,
    getSiteContacts,
    displayContactsSite,
};
export default siteContactCntrl ; 