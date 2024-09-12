const app = require("./app");
const { sequelize } = require("./models");

const PORT = process.env.PORT || 4000;

// Sync database and start server
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database synced");
    app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to sync database:", err);
  });
