import { supabase } from "../../config/supabaseClient.js";
import pLimit from "p-limit";
const limit = pLimit(3); // Limit concurrent requests to 3 to avoid rate limits

const fetchWithRetry = async (fn, retries = 3, delay = 500) => {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await fn();
      // Ensure response is valid JSON (fixes "Unexpected token '<'")
      if (!result || typeof result !== "object") {
        throw new Error("Invalid response format from Supabase.");
      }
      return result;
    } catch (error) {
      console.error(`API request failed (attempt ${i + 1}):`, error.message);

      if (error.message.includes("429") || error.message.includes("Too many requests")) {
        console.warn(`Too many requests. Retrying in ${(delay * (i + 1))}ms...`);
      }

      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1))); // Exponential backoff
      }
    }
  }
  return null;
};
const checkFilesExistWithoutId = async (component, Sid) => {
  try {
    const folderPath = `${component}-pdf/${Sid}`;
    console.log(`🔍 Checking files in: ${folderPath}`);
    // Use pLimit to prevent excessive parallel requests
    const response = await limit(() =>
      fetchWithRetry(() => supabase.storage.from(`${component}-pdf`).list(folderPath, { limit: 5 }))
    );

    if (!response || !Array.isArray(response.data)) {
      console.error(`Invalid response or no data from Supabase for ${component}`);
      return false;
    }
    // Filter out empty placeholders
    const filteredData = response.data.filter(file => file.name !== ".emptyFolderPlaceholder");
    console.log(`Found ${filteredData.length} files in ${folderPath}`);
    return filteredData.length > 0;
  } catch (error) {
    console.error(`Error in checkFilesExistWithoutId for ${component}:`, error);
    return false;
  }
};
const fileDynFieldsModel = {
  checkFilesExistWithoutId,
};
export default fileDynFieldsModel;
