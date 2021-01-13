// Module
const Joi = require('joi');

// Register Validation
exports.registerValidation = (data) => {

    const schema = Joi.object().keys({
        userName: Joi.string().min(2).max(255).required(),
        firstName: Joi.string().min(2).max(255).required(),
        lastName: Joi.string().min(2).max(255).required(),
        email: Joi.string().min(6).max(255).required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'de'] } }),
        password: Joi.string().min(6).max(1024).required(),
        passwordConfirmation: Joi.string().valid(Joi.ref('password')).required(),
        confirmEmail: Joi.string().valid(Joi.ref('email')).required(),
        profilePicture: Joi.any().meta({ swaggerType: 'file' }).optional().allow('').description('image file')
    });

    return schema.validate(data);
};

// edit Validation
exports.editValidation = (data) => {

    const schema = Joi.object().keys({
        userName: Joi.string().min(2).max(255).optional(),
        firstName: Joi.string().min(2).max(255).optional(),
        lastName: Joi.string().min(2).max(255).optional(),
        email: Joi.string().min(6).max(255).optional().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'de'] } }),
        password: Joi.string().min(6).max(1024).optional(),
        passwordConfirmation: Joi.string().valid(Joi.ref('password')).required(),
        confirmEmail: Joi.string().valid(Joi.ref('email')).required(),
        profilePicture: Joi.any().meta({ swaggerType: 'file' }).optional().allow('').description('image file')
    });

    return schema.validate(data);
};