import { asyncHandler } from "../middleware/asyncHandler.middleware.js";
import { getCurrentUserService } from "../services/user.service.js";


export const getcurrentUserController = asyncHandler(async (req, res, next) => {
    const userId = req.user?._id;

    const { currentUser } = await getCurrentUserService(userId);

    return res.status(200).json({
        user: currentUser,
        message: "User fetched successfully",
    });

})