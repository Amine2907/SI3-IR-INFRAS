import fileDynFieldsModel from "../../../storage/DynFields/getFiles.js";
const checkFilesForAllComponent = async (req, res) => {
    try {
      const components = ["demrac", "devis","mes"];
      const Sid = req.params.Sid;
    // Validate Sid
    if (!Sid) {
      return res.status(400).json({ success: false, error: "Sid is required." });
    }
      const fileStatuses = {};
      for (const component of components) {
        const result = await fileDynFieldsModel.checkFilesExistWithoutId(component,Sid);
        fileStatuses[component] = result.hasFiles;
      }
  
      return res.status(200).json({ success: true, fileStatuses });
    } catch (error) {
      console.error("Error in checkAllComponentFiles:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  };
const fileDynFieldsController = {
  checkFilesForAllComponent,
};

export default fileDynFieldsController;
