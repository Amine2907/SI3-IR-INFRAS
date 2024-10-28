import { supabase } from "../config/supabaseClient.js";
const getAllUsers = async() => {
    try {
        const {data , error } = await supabase
        .from('ausers')
        .select('*')
        if (error) {
            throw error ; 
        } 
        return {success:true , data };
    } catch(error) {
        return {success:false , error : error.message};
    }
    };
    const getDisplayName = async () => {
        try {
          const { data, error } = await supabase.auth.getUser();
      
          // Check if user data is null or undefined
          if (!data || !data.user) {
            throw new Error("No authenticated user found");
          }
      
          const displayName = data.user.user_metadata?.display_name;
      
          // Check if display name is available in user_metadata
          if (!displayName) {
            throw new Error("Display name not found");
          }
      
          return { success: true, displayName };
        } catch (error) {
          return { success: false, error: error.message };
        }
      };
const getUsersModel = {
    getAllUsers,
    getDisplayName,
}
export default getUsersModel ; 