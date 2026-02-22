import joi from "joi";

// User validation schemas
export const userRegisterSchema = joi.object({
  name: joi.string().min(2).max(255).required().messages({
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name cannot exceed 255 characters",
    "any.required": "Name is required",
  }),
  email: joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  password: joi
    .string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters",
      "string.pattern.base":
        "Password must contain uppercase, lowercase, number and special character",
      "any.required": "Password is required",
    }),
  confirm_password: joi
    .string()
    .valid(joi.ref("password"))
    .required()
    .messages({
      "any.only": "Passwords do not match",
      "any.required": "Please confirm your password",
    }),
});

export const userLoginSchema = joi.object({
  email: joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  password: joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

export const userUpdateSchema = joi.object({
  name: joi.string().min(2).max(255).optional(),
  phone: joi
    .string()
    .pattern(/^\+?[\d\s-]{10,}$/)
    .optional(),
  address: joi.string().max(500).optional(),
  city: joi.string().max(100).optional(),
  state: joi.string().max(100).optional(),
  postal_code: joi.string().max(20).optional(),
  country: joi.string().max(100).optional(),
});

// Product validation schemas
export const productCreateSchema = joi.object({
  title: joi.string().min(3).max(255).required().messages({
    "string.min": "Product title must be at least 3 characters",
    "string.max": "Product title cannot exceed 255 characters",
    "any.required": "Product title is required",
  }),
  description: joi.string().min(10).max(2000).required().messages({
    "string.min": "Description must be at least 10 characters",
    "string.max": "Description cannot exceed 2000 characters",
    "any.required": "Description is required",
  }),
  price: joi.number().positive().required().messages({
    "number.positive": "Price must be greater than 0",
    "any.required": "Price is required",
  }),
  discount_percent: joi.number().min(0).max(100).optional().messages({
    "number.min": "Discount cannot be less than 0%",
    "number.max": "Discount cannot exceed 100%",
  }),
  stock: joi.number().integer().min(0).required().messages({
    "number.min": "Stock must be 0 or greater",
    "any.required": "Stock quantity is required",
  }),
  image_url: joi.string().uri().optional().messages({
    "string.uri": "Image URL must be a valid URI",
  }),
  category: joi.string().max(255).optional(),
  brand: joi.string().max(255).optional(),
});

export const validateRequest = async (schema: joi.ObjectSchema, data: any) => {
  try {
    const validated = await schema.validateAsync(data, { abortEarly: false });
    return { valid: true, data: validated, errors: null };
  } catch (error: any) {
    const errors =
      error.details?.map((detail: any) => ({
        field: detail.path.join("."),
        message: detail.message,
      })) || [];
    return { valid: false, data: null, errors };
  }
};
