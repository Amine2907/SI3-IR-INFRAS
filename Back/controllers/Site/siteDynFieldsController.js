import siteDynFieldsModel from "../../models/Site/siteDynamicFields.js";
const getPropsectRetenu = async (req, res) => {
    try {
      const Sid = req.params.Sid;
      const data = await siteDynFieldsModel.getPropsectretenu(Sid);
      
      // Check if data is empty
      if (!data || data.length === 0) {
        return res.status(404).json({ error: 'No data found for the provided Sid' });
      }
  
      return res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching Prospect Retenu:', error.message);
      return res.status(500).json({ error: 'An error occurred while fetching Prospect Retenu' });
    }
  };
  const getDrDate  = async (req, res) => {
    try {
      const Sid = req.params.Sid;
      const result = await siteDynFieldsModel.getDrDate(Sid);
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      return res.status(200).json(result.data);
    } catch (error) {
      console.error('Error fetching Dr Date', error.message);
      return res.status(500).json({ error: 'An error occurred while fetching Dr Date' });
    }
  }
  const getDevisDate  = async (req, res) => {
    try {
      const Sid = req.params.Sid;
      const result = await siteDynFieldsModel.getDevisRecDate(Sid);
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      return res.status(200).json(result.data);
    } catch (error) {
      console.error('Error fetching Devis Date', error.message);
      return res.status(500).json({ error: 'An error occurred while fetching Devis Date' });
    }
  }
  const getReglementDate  = async (req, res) => {
    try {
      const Sid = req.params.Sid;
      const result = await siteDynFieldsModel.getReglementDate(Sid);
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      return res.status(200).json(result.data);
    } catch (error) {
      console.error('Error fetching reglement Date', error.message);
      return res.status(500).json({ error: 'An error occurred while fetching Reglement Date' });
    }
  }
  const getMesDate = async (req, res) => {
    try {
        const Sid = req.params.Sid;
        const result = await siteDynFieldsModel.getMesReel(Sid);

        if (!result.success) {
            return res.status(200).json({ message: result.error }); // Send a user-friendly message
        }

        return res.status(200).json({ MES_reel: result.data });
    } catch (error) {
        console.error('Error fetching MES reel date:', error.message);
        return res.status(500).json({ error: 'An unexpected error occurred while fetching MES reel date.' });
    }
};
  const siteFieldsController = {
    getPropsectRetenu,
    getDrDate,
    getDevisDate,
    getReglementDate,
    getMesDate,
}
export default siteFieldsController ; 