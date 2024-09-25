require("dotenv").config();

module.exports = {
  development: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    // Tidak perlu SSL untuk development
  },
  test: {
    use_env_variable: "TEST_DATABASE_URL",
    dialect: "postgres",
    logging: false, // Disable logging for tests
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    dialectModule: require("pg"),
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: console.log,
  },
};
