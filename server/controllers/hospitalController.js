import User from '../models/userModel.js';
import Hospital from '../models/hospitalModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import * as factory from './handlerFactory.js';

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

export const updateMe = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                'This route is not for password update. Please use updateMyPassword',
                400
            )
        );
    }

    const filteredBody = filterObj(
        req.body.profile,
        'name',
        'email',
        'contact',
    );

    const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser,
        },
    });
});

export const deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, { active: false });
    res.status(204).json({
        status: 'success',
        data: null,
    });
});

export const getUser = factory.getOne(User);

export const getHospitalById = catchAsync(async (req, res, next) => {
    const hospital = await Hospital.findById(req.user._id);

    if (!hospital) {
        return next(new AppError('No donor found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            hospital,
        },
    });
});


export const createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined! Please use signup instead',
    });
};

export const getAllUsers = factory.getAll(User);
export const deleteUser = factory.deleteOne(User);
