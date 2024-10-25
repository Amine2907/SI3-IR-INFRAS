
import getUsersModel from "../models/getUsersModel.js";
const getUserInfo = async(req,res) => {
    const result = await getUsersModel.getAllUsers();
    if(!result.success){
        return res.status(400).json({error : result.error});
    }
    res.status(200).json(result.data);
};
const getDisplayName = async(req,res) => {
    const result = await getUsersModel.getDisplayName(req.params.id);
    if(!result.success){
        return res.status(400).json({error : result.error});
    }
    res.status(200).json(result.data);  
}
const getUsersController = {
    getUserInfo,
    getDisplayName,
}
export default getUsersController ; 