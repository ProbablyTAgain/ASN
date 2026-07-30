import express from "express";
import suggestCountryRouter from "./src/api/suggestCountry.js";

const app = express();
const PORT = 5000;

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use("/api", suggestCountryRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});