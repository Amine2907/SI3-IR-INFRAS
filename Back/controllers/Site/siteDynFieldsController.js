import siteDynFieldsModel from "../../models/Site/siteDynamicFields.js";
const getPropsectRetenu  = async (req, res) => {
    try {
      const Sid = req.params.id;
      const result = await siteDynFieldsModel.getPropsectretenu(Sid);
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      return res.status(200).json(result.data);
    } catch (error) {
      console.error('Error fetching Prospect Retenu', error.message);
      return res.status(500).json({ error: 'An error occurred while fetching Proepsct Retenu' });
    }
  }
  const getDrDate  = async (req, res) => {
    try {
      const Sid = req.params.id;
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
      const Sid = req.params.id;
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
      const Sid = req.params.id;
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
  const getMesDate  = async (req, res) => {
    try {
      const Sid = req.params.id;
      const result = await siteDynFieldsModel.getMesReel(Sid);
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      return res.status(200).json(result.data);
    } catch (error) {
      console.error('Error fetching mise en service Date', error.message);
      return res.status(500).json({ error: 'An error occurred while fetching mise en service  Date' });
    }
  }
  const siteFieldsController = {
    getPropsectRetenu,
    getDrDate,
    getDevisDate,
    getReglementDate,
    getMesDate,
}
export default siteFieldsController ; 