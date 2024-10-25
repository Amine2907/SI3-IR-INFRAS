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
    const getUsersModel = {
        getAllUsers,
    }
    export default getUsersModel ; 