import Joi from "joi";

const movieSchema = Joi.object({
    title: Joi.string().trim().required(),
    year: Joi.number().required().greater(1900).less(2027)
})

export default movieSchema;