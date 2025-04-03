const validator = require("validator");
const User = require("../models/user");

const validateSignupData = async(req) => {
    const { firstName, lastName, email, password, age, experienceLevel, location, gender, education, workExperience, profileSummary } = req.body;

    // Validate firstName
    if (!firstName || typeof firstName !== 'string' || firstName.trim().length < 2) {
        throw new Error("First name is required and must be at least 2 characters long.");
    }

    // Validate lastName (if provided)
    if (lastName && (typeof lastName !== 'string' || lastName.trim().length < 3)) {
        throw new Error("Last name must be at least 3 characters long if provided.");
    }

    // Validate email
    if (!email || !validator.isEmail(email)) {
        throw new Error("A valid email address is required.");
    }

    // Check if email already exists
    const isEmailExists = await User.findOne({ email: email });
    if (isEmailExists) {
        throw new Error("Email already exists. Please Login");
    }

    // Validate password
    if (!password || !validator.isStrongPassword(password)) {
        throw new Error('Password is required and must be strong enough.');
    }

    // Validate age (if provided)
    if (age !== undefined) {
        // Convert age to string because validator methods typically work with strings.
        if (!validator.isInt(String(age))) {
            throw new Error('Age must be a number and at least 18.');
        }
    }

    // Validate experienceLevel (if provided)
    const allowedExperienceLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
    if (experienceLevel && !(allowedExperienceLevels.includes(String(experienceLevel).toLowerCase()))) {
        throw new Error(`Experience level must be one of: ${allowedExperienceLevels.join(', ')}.`);
    }

    // Validate location (if provided)
    if (location && typeof location === 'string' && location.trim().length === 0) {
        throw new Error('Location, if provided, cannot be an empty string.');
    }

    // Validate gender (if provided)
    const allowedGenders = ['male', 'female', 'other'];
    if (gender && !allowedGenders.includes(String(gender).toLowerCase())) {
        throw new Error('Gender must be "male", "female", or "other".');
    }

    // Validate education
    if (education && typeof education !== 'string') {
        throw new Error('Education must be a string.');
    }

    if(workExperience && typeof workExperience !== 'string') {
        throw new Error('Work experience must be a string.');
    }

    if(profileSummary && typeof profileSummary !== 'string') {  
        throw new Error('Profile summary must be a string.');
    }
};
// validator.js (or any appropriate file)
const validateEditProfileData = (req) => {
    const { skills } = req.body;
    // Define an array of allowed fields for update.
    // Make sure to exclude 'email' or any other fields you don't want to allow.
    const allowedUpdates = [
        'firstName',
        'lastName',
        'age',
        'bio',
        'skills',
        'experienceLevel',
        'location',
        'profilePicture',
        'gender',
        'education',
        'workExperience',
        'socialLinks',
        'profileSummary',
    ];

    // Extract the keys from the update object.
    const updateKeys = Object.keys(req.body);

    // Check if every key in the update is in the allowedUpdates list.
    const isValidOperation = updateKeys.every((key) => allowedUpdates.includes(key));

    if (!isValidOperation) {
        throw new Error("Invalid updates! Only allowed fields can be updated and email cannot be updated.");
    }

    // If skills is provided, check its length.
    if (skills && skills.length > 30) {
        throw new Error("You can only add up to 30 skills");
    }
};

module.exports = { validateSignupData, validateEditProfileData };
