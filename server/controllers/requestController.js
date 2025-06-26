import BloodRequest from "../models/requestModel.js";
import * as factory from "./handlerFactory.js";
import Hospital from "../models/hospitalModel.js";
import User from "../models/userModel.js";
import { sendMail } from "../utils/sendEmail.js";

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const updateRequest = async (req, res, next) => {
  try {
    const { id, status } = req.body;

    if (!id) {
      return res.status(400).json({ status: 'fail', message: 'Request ID is required' });
    }

    const filteredBody = filterObj(
      req.body,
      'patientName',
      'contactNumber',
      'age',
      'unitsRequired',
      'bloodGroup',
      'status'
    );

    const update = { ...filteredBody };

    if (status === 'booked') {
      update.donor = req.user._id; // Assign the donor directly
    }

    if (status === 'open' && req.user.role === 'hospital') {
      // Clear the donor reference
      update.donor = null;
    }

    const updatedRequest = await BloodRequest.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!updatedRequest) {
      return res.status(404).json({ status: 'fail', message: 'Request not found' });
    }

    res.status(200).json({
      status: 'success',
      data: {
        request: updatedRequest,
      },
    });
  } catch (err) {
    console.error("err: ", err.message);
    res.status(500).json({ status: 'fail', message: err.message });
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
    // const all = await BloodRequest.find().populate('donor', 'hospital');
    // console.log(all);

    const hospitalId = req.user._id;
    // console.log(req);
    const requests = await BloodRequest.find({ hospital: hospitalId })
      .populate("hospital", "name location ")
      .populate("donor");

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
      "hospitalName location email contact"
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

export const createRequestAndSendEmail = async (req, res) => {
  try {
    console.log("reqBodyReq: ", req.body.request);
    const { patientName, contactNumber, bloodGroup, unitsRequired, age } =
      req.body.request;
    const hospital = req.user._id;

    const newRequest = await BloodRequest.create({
      patientName,
      contactNumber,
      bloodGroup,
      age: Number(age),
      unitsRequired,
      hospital,
    });

    const hospitalDetails = await Hospital.findById(hospital);
    if (!hospitalDetails || !hospitalDetails.location?.coordinates) {
      return res.status(404).json({
        status: "fail",
        message: "Hospital or location not found",
      });
    }

    const [longitude, latitude] = hospitalDetails.location.coordinates;
    const radius = 200;
    const earthRadius = 6371;

    const donors = await User.find({
      role: "donor",
      location: {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], radius / earthRadius],
        },
      },
    });

    console.log(donors);

    if (!donors.length) {
      return res.status(404).json({
        status: "fail",
        message: "No donors found for the specified criteria",
      });
    }

    for (const donor of donors) {
      await sendMail(
        donor.email,
        "Urgent Blood Donation Needed",
        `Dear ${donor.name},\n\nWe urgently need blood group ${bloodGroup} at ${hospitalDetails.name}. Your help can save a life!\n\nPlease visit the following link for more details:\nhttp://localhost:5173/dashboard/requirements\n\nRegards,\n${hospitalDetails.name} Team`
      );
    }

    res.status(201).json({
      status: "success",
      message: "Request created and emails sent",
      data: {
        request: newRequest,
        donorsNotified: donors.length,
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
