const getAllUsers = async() => {
    try {
        const {data , error } = await supabase
        .from('auth.users')
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