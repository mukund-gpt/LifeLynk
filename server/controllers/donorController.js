import User from "../models/userModel.js";
import Donor from "../models/donorModel.js";
import Hospital from "../models/hospitalModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import * as factory from "./handlerFactory.js";

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

export const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password update. Please use updateMyPassword",
        400
      )
    );
  }

  const filteredBody = filterObj(
    req.body,
    "name",
    "email",
    "contact",
    "bloodGroup",
    "metaMaskId",
    "location"
  );
  console.log(filteredBody);
  const updatedUser = await Donor.findByIdAndUpdate(
    req.user._id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );
  console.log(updatedUser);
  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

export const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const getDonorById = catchAsync(async (req, res, next) => {
  const donor = await Donor.findById(req.user._id);

  if (!donor) {
    return next(new AppError("No donor found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      donor,
    },
  });
});
export const getUser = factory.getOne(User);






