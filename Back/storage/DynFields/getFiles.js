import { supabase } from "../../config/supabaseClient.js";

const checkFilesExist = async (component, componentId) => {
  try {
    const folderPath = `${component}-pdf/${componentId}`;
    console.log(`Checking files in folder: ${folderPath}`);
    
    const { data, error } = await supabase.storage
      .from(`${component}-pdf`)
      .list(folderPath);

    if (error) {
      console.error(`Error checking files for ${component}:`, error);
      return { success: false, hasFiles: false };
    }
    // If files exist in the folder, return success
    return { success: true, hasFiles: data.length > 0 };
  } catch (error) {
    console.error(`Error in checkFilesExist for ${component}:`, error);
    return { success: false, hasFiles: false };
  }
};

const fileDynFieldsModel = {
  checkFilesExist,
};

export default fileDynFieldsModel;
