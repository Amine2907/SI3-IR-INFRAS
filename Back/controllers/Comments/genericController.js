import GenericModel from "../../models/Comments/genericModel.js";
const genericController = {
  // Create a new record in the table
  create: async (req, res) => {
    const { table } = req.params;
    const payload = req.body;
    
    try {
      const model = new GenericModel(table); // Instantiate with table name
      const data = await model.create(payload); // Call create method
      res.status(201).json({ data });
    } catch (error) {
      res.status(500).json({ message: `Error creating record: ${error.message}` });
    }
  },

  // Get all records from the table
  getAll: async (req, res) => {
    const { table } = req.params;
    
    try {
      const model = new GenericModel(table);
      const data = await model.findAll();
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ message: `Error fetching records: ${error.message}` });
    }
  },

  // Get a record by ID from the table
  getById: async (req, res) => {
    const { table, id } = req.params;

    try {
      const model = new GenericModel(table);
      const data = await model.findById(id);
      if (!data) return res.status(404).json({ message: `Record not found` });
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ message: `Error fetching record: ${error.message}` });
    }
  },

  // Update a record by ID
  update: async (req, res) => {
    const { table, id } = req.params;
    const payload = req.body;

    try {
      const model = new GenericModel(table);
      const data = await model.update(id, payload);
      if (!data) return res.status(404).json({ message: `Record not found` });
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ message: `Error updating record: ${error.message}` });
    }
  },

  // Delete a record by ID
  delete: async (req, res) => {
    const { table, id } = req.params;

    try {
      const model = new GenericModel(table);
      const data = await model.delete(id);
      if (!data) return res.status(404).json({ message: `Record not found` });
      res.status(200).json({ message: `Record deleted successfully` });
    } catch (error) {
      res.status(500).json({ message: `Error deleting record: ${error.message}` });
    }
  },
};

export default genericController;
