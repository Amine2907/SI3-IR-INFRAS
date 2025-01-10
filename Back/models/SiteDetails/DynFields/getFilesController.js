import fileDynFieldsModel from "../../../storage/DynFields/getFiles.js";
const checkFilesForComponent = async (req, res) => {
  try {
    const { component, componentId } = req.params;

    // Validate the component type
    const validComponents = ["prospect", "declPreal","pre-etude", "demrac", "devis", "paie", "travs", "mes"];
    if (!validComponents.includes(component)) {
      return res.status(400).json({ error: "Invalid component type." });
    }
    // Call the model to check file existence
    const result = await fileDynFieldsModel.checkFilesExist(component, componentId);

    if (!result.success) {
      return res.status(500).json({ error: `Error checking files for ${component}.` });
    }

    return res.status(200).json({ hasFiles: result.hasFiles });
  } catch (error) {
    console.error("Error in checkFilesForComponent:", error.message);
    return res.status(500).json({ error: "An error occurred while checking for files." });
  }
};

const fileDynFieldsController = {
  checkFilesForComponent,
};

export default fileDynFieldsController;
