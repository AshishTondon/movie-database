import Joi from "joi";

const loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string()
    .trim()
    .required()
    .pattern(new RegExp("^[a-zA-Z0-9]{8,30}$")),
  rememberMe: Joi.boolean(),
});

export default loginSchema;
