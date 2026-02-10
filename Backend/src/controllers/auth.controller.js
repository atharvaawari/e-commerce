import { asyncHandler } from "../middleware/asyncHandler.middleware.js";
import { User } from "../models/user.module.js";
import { ApiError } from "../utils/ApiError.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false }); //to save refresh token in db

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "generating refresh and access token failed");
  }
};

const loginCotroller = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findOne({
    $or: [{ email: email }],
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isPasswordMatch = await user.isPasswordCorrect(password);

  if (!isPasswordMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true, // true ONLY on HTTPS
    sameSite: "none", // or "none" for production
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({ message: "Login successful", user: loggedInUser, accessToken });
});

const registerController = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  console.log("Register body:", req.body);

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const existingUser = await User.findOne({
    $or: [{ email: email }, { name: name }],
  });
  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  const role = req.body.role || "user";
  const newUser = await User.create({ name, email, password, role });

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    newUser._id
  );

  const createdUser = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      message: "User registered successfully",
      user: createdUser,
      accessToken,
      refreshToken,
    });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incommingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
    
    console.log("incommingRefreshToken", incommingRefreshToken);

  if (!incommingRefreshToken) throw new ApiError(401, "unauthorized request");

  try {
    const decodedToken = verify(
      incommingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) throw new ApiError(401, "invalid refresh token");

    if (incommingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "AccessToken refresh successfully"
        )
      );
  } catch (error) {
    if (error)
      throw new res.ApiError(401, error?.message || "Invalid refresh token");
  }
});



const logoutController = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({ message: "User logged out" })
})

export { loginCotroller, registerController, refreshAccessToken, logoutController };
