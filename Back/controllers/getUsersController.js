
import getUsersModel from "../models/getUsersModel.js";
const getAllUsers = async(req,res) => {
    const result = await getUsersModel.getUserInfo();
    if(!result.success){
        return res.status(400).json({error : result.error});
    }
    res.status(200).json(result.data);
};
const getUsersController = {
    getAllUsers,
}
export default getUsersController ; 