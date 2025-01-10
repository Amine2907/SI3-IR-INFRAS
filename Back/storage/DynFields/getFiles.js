import { supabase } from "../../config/supabaseClient.js";

const checkFilesExistWithoutId = async (component, Sid) => {
  try {
    // Construct the folder path dynamically
    const folderPath = `${component}-pdf/${Sid}`;
    console.log(`Checking files in folder: ${folderPath}`);

    // List files in the folder
    const { data, error } = await supabase.storage
      .from(component + "-pdf") // Use static bucket name
      .list(folderPath);

    if (error) {
      console.error(`Error checking files for ${component}:`, error);
      return { success: false, hasFiles: false };
    }
    // Check if any files exist
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
