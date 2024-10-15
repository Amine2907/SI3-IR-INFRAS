import { supabase } from "../Config/supabaseClient.js";

//Get Account informations 
const getAccountInfo = async(userId) => {
    try {
        const {data,error} = await supabase
        .from('auth.users')
        .select('fields_here') // need to update auth.users 
        .eq('id',userId)
        .single();
        if(error){
            throw error ; 
        }
        return {success:true , data};
    }catch(error){
        return {success:false,error:error.message};
    }
};

// Update password 
const updatePassword = async(userId,newPassword) =>{
    try {
        const{error} = await supabase.auth.updateUser({id:userId,password:newPassword});
        if(error){
            throw error ; 
        }
        return {success:true};
    }catch(error){
        return {success:false ,error:error.message};
    };
};
// Get current password 
const getCurrentPassword = async(userId) => {
    try {
        const{data,error} = await supabase
        .from('auth.users')
        .select('password')
        .eq('id',userId)
        .single();
        if(error){
            throw error ;
        }
        return {success:true ,data : data.password };
    }catch(error){
        return {success:false,error:error.message};
    }
};
// List all users 
const listUsers = async() => {
    try {
        const{data,error} = await supabase 
        .from('auth.users')
        .select('fields_here');
        
        if(error){
            throw error ;
        }
        return {success:true , data };
    }catch(error){
        return {success:false,error:error.message};
    }
};
// List all companies 
const listCompanies = async() => {
    try {
        const {data,error} = await supabase
        .from('Entreprise')
        .select('nom,site_web,siret,is_active');
        if(error){
            throw error ;
        }
        return {success:true , data };
    }catch(error){
        return {success:false,error:error.message};
    }
};
const settingsModel = {
    getAccountInfo,
    getCurrentPassword,
    updatePassword,
    listCompanies,
    listUsers,
}
export default settingsModel; 