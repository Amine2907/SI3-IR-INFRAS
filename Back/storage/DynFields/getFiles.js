import { supabase } from "../../config/supabaseClient.js";

const checkFilesExistWithoutId = async (component) => {
  try {
    const folderPath = `${component}-pdf`;
    console.log(`Checking files in folder: ${folderPath}`);
    
    // List all subfolders and files in the component's root folder
    const { data, error } = await supabase.storage.from(folderPath).list();

    if (error) {
      console.error(`Error checking files for ${component}:`, error);
      return { success: false, hasFiles: false };
    }

    // Check if any files or folders exist in the root folder
    const hasFiles = data && data.length > 0;
    return { success: true, hasFiles };
  } catch (error) {
    console.error(`Error in checkFilesExistWithoutId for ${component}:`, error);
    return { success: false, hasFiles: false };
  }
};

const fileDynFieldsModel = {
  checkFilesExistWithoutId,
};

export default fileDynFieldsModel;
