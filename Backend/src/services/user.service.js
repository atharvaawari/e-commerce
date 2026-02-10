import { User } from "../models/user.module.js";


export const getCurrentUserService = async (userId) => {
    // Assuming User is already imported
    const currentUser = await User.findById(userId).select("-password");

    if (!currentUser) {
        throw new Error("User not found");
    }                                   

    return { currentUser };
}