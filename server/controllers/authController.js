import { promisify } from "util";
import jwt from "jsonwebtoken";
import User from "./../models/userModel.js";
import catchAsync from "./../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import Donor from "../models/donorModel.js";
import Hospital from "../models/hospitalModel.js";

const signToken = (id) => {
  //payload(data),jwt secret,jwt expire time
  return jwt.sign(
    {
      id: id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);

  //Remove the password from the password
  user.password = undefined;
  console.log("Generated Token:", token);

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

export const signup = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const {
    role,
    name,
    email,
    password,
    passwordConfirm,
    passwordChangedAt,
    contact,
    location,
    radiusKm,
    bloodGroup,
    metaMaskId,
    licenseNumber,
    address,
    hospitalName,
  } = req.body;

  let newUser;

  if (role === "donor") {
    newUser = await Donor.create({
      name,
      email,
      password,
      passwordConfirm,
      passwordChangedAt,
      contact,
      location,
      radiusKm,
      bloodGroup,
      metaMaskId,
    });
  } else if (role === "hospital") {
    newUser = await Hospital.create({
      name,
      email,
      password,
      passwordConfirm,
      passwordChangedAt,
      contact,
      address,
      hospitalName,
      licenseNumber,
      metaMaskId,
    });
  } else {
    return next(
      new AppError(
        "Invalid role provided. Please select 'donor' or 'hospital'.",
        400
      )
    );
  }
  createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //1)Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password !", 400));
  }
  //2)Check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  //3)If everything ok,send token to client
  createSendToken(user, 200, res);
});
// exports.logout = (req, res) => {
//   res.cookie('jwt', 'loggedout', {
//     expires: new Date(Date.now() + 10 * 1000 * 60),
//     httpOnly: true,
//   });
//   res.status(200).json({ status: 'success' });
// };

export const logout = (req, res) => {
  res.cookie("accessToken", "loggedout", {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
  });
  res.cookie("refreshToken", "", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({ status: "success" });
};

export const protect = async (req, res, next) => {
  //1)getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    // console.log(token);
    return next(
      new AppError("You are not logged in! Please log in to get access"),
      401
    );
  }
  //2)Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);

  //3)Check if user still exits
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token does no longer exit", 401)
    );
  }
  //4)Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        "User recently changed the password ! please login again",
        401
      )
    );
  }
  //GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
};

export const updatePassword = catchAsync(async (req, res, next) => {
  //1)Get user from collection
  const user = await User.findById(req.user.id).select("+password");
  //2)Check if POSTED current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Password is wrong.please try again", 401));
  }
  //3)If so,update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  //
  /*
    Q:why we can not use User.findByIdAndUpdate
    ans:1.this.property is not work bacause at this time moongoose not have currnet object
    2.middleware which we use to password hashed before the save in database is not work because it updated by findByIdAndUpdate not saved
  */

  //4)Log user in,send JWT
  createSendToken(user, 200, res);
});
