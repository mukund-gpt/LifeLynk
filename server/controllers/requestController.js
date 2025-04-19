import BloodRequest from "../models/requestModel.js";
import * as factory from "./handlerFactory.js";

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const updateRequest = async (req, res, next) => {
  try {
    const { id } = req.body
    const filteredBody = filterObj(
      req.body,
      'patientName',
      'contactNumber',
      'age',
      'unitsRequired',
      'bloodGroup'
    );

    const updatedRequest = await BloodRequest.findByIdAndUpdate(id, filteredBody, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        request: updatedRequest,
      },
    });
  } catch (err) {
    console.log("err: ", err.message)
  }
};

export const createRequest = async (req, res) => {
  try {
    const { patientName, contactNumber, bloodGroup, unitsRequired, age } = req.body.request;
    const hospital = req.user._id;

    const newRequest = await BloodRequest.create({
      patientName,
      contactNumber,
      bloodGroup,
      age: Number(age),
      unitsRequired: Number(unitsRequired),
      hospital,
    });

    res.status(201).json({
      status: "success",
      newRequest,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    try {
      const user = req.user;
      if (!user || !roles.includes(user.role)) {
        return res.status(403).json({
          status: "fail",
          message: "You do not have permission to perform this action",
        });
      }
      next();
    } catch (error) {
      res.status(500).json({
        status: "fail",
        message: error.message,
      });
    }
  };
};

export const getAllRequestsForHospital = async (req, res) => {
  try {
    const all = await BloodRequest.find();
    console.log(all);

    const hospitalId = req.user._id;
    // console.log(req);
    const requests = await BloodRequest.find({ hospital: hospitalId }).populate(
      "hospital",
      "name location"
    );

    // Respond with the blood requests
    res.status(200).json({
      status: "success",
      results: requests.length,
      requests,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

export const getAllOpenRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.find({ status: "open" }).populate(
      "hospital",
      "name location"
    );

    res.status(200).json({
      status: "success",
      results: requests.length,
      requests,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

export const getAllRequests = factory.getAll(BloodRequest);

import User from "../models/userModel.js";
import Hospital from "../models/hospitalModel.js";
import AppError from "../utils/appError.js";

export const sendEmailToDonors = async (req, res, next) => {
  try {
    const hospitalId = req.user._id;

    const hospital = await Hospital.findById(hospitalId);
    if (!hospital || !hospital.location || !hospital.location.coordinates) {
      return next(new AppError("Hospital or location not found", 404));
    }

    const [longitude, latitude] = hospital.location.coordinates;
    const earthRadius = 6371; // Earth's radius in km
    const radius = 20; // Search radius in km

    const { bloodGroup, unitsRequired } = req.body;

    const donors = await User.find({
      role: "donor",
      bloodGroup,
      location: {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], radius / earthRadius],
        },
      },
    });

    if (!donors.length) {
      return res.status(404).json({
        status: "fail",
        message: "No donors found for the specified criteria",
      });
    }

    // TODO: Send email to each donor (use nodemailer, etc.)

    res.status(200).json({
      status: "success",
      message: "Emails sent to donors successfully",
      data: {
        donors,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};
//delete request
export const deleteRequest = async (req, res) => {
  try {
    const { id } = req.body;
    await BloodRequest.findByIdAndDelete(id);
    return res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.log("error: ", err.message);
    return res.status(500).json({ message: "Server error" });

  }
};

//update request status
export const updateRequestStatus = async (req, res) => {
  try {
    console.log(req);
    const { id, status } = req.body;
    const updatedRequest = await BloodRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      data: {
        request: updatedRequest,
      },
    });
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

