const Joi = require('joi')

module.exports.noriturSchema = Joi.object({
    noritur: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
    }).required() 
}) //유효성 검사

module.exports.resellSchema = Joi.object({
    noritur: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required.min(0),
    }).required() 
}) //유효성 검사