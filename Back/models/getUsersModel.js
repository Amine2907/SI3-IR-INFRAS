import { supabase } from "../Config/supabaseClient.js";

const getUserInfo = async () => {
    try {
        // Attempt to retrieve the currently logged-in user
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        // Check for errors in retrieving the user
        if (userError) {
            throw userError; // Handle user retrieval error
        }

        // If there is no authenticated user
        if (!user) {
            return { success: false, error: "User is not authenticated." };
        }

        // If the user is authenticated, return user information
        return { success: true, user }; // Return the authenticated user's data
    } catch (error) {
        return { success: false, error: error.message }; // Return error message on failure
    }
};

const getUsersModel = {
    getUserInfo,
};
export default getUsersModel;
