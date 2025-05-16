import Joi from "joi";

// data validation schema for student creation
export const createStudentSchema = Joi.object({
    userID: Joi.string().required(),
    program: Joi.string().required(),
    grades: Joi.array.items((Joi.object({
        courseCode: Joi.string().min(6).max(20).required(),
        courseName: Joi.string().min(3).max(40).required(),
        grade: Joi.number()
    }))),
    cumulativeGPA: Joi.number(),
    dormitory: Joi.object({
        block: Joi.string().min(3).max(5),
        roomNumber: Joi.number().integer().max(3)
    }),
    warnings: Joi.array().items(Joi.string())
})

// data validation for student update/ patch and put request

export const updateStudentSchema = Joi.object({
  userID: Joi.string(),
  program: Joi.string(),
  grades: Joi.array.items((Joi.object({
        courseCode: Joi.string().min(6).max(20),
        courseName: Joi.string().min(3).max(40),
        grade: Joi.number()
    }))),
  cumulativeGPA: Joi.number().min(0).max(4),
  dormitory: Joi.object({
        block: Joi.string().min(1),
        roomNumber: Joi.number().integer().min(1)
    }),
  warnings: Joi.array().items(Joi.string())
});
