const joi = require('joi');
require('dotenv').config();

// Defining a schema for our environment variables using Joi
const envVarSchema = joi
  .object({
    DATABASE_URI: joi.string().required().description('Database connection string is required'),
    PORT: joi.number().positive().default(3000).description('Port number for the server'),
    NODE_ENV: joi.string().valid('development', 'production', 'test').default('development').description('Environment'),
    JWT_SECRET: joi.string().required().description('Secret code of jwt is required')
  })
  .unknown(); // Allow other unknown environment variables

// Validating the environment variables against the schema
const { value: envVars, error } = envVarSchema.validate(process.env, { stripUnknown: true });

if (error) {
  console.error(`Config validation error: ${error.message}`);
  process.exit(1); // Exit process with failure code
}

module.exports = {
  port: envVars.PORT,
  dbConnection: envVars.DATABASE_URI,
  nodeEnv: envVars.NODE_ENV,
  JWT_SECRET:envVars.JWT_SECRET
};
