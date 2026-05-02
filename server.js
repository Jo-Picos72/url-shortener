require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Routes
const linkRoutes = require("./routes/linkRoutes");
app.use("/", linkRoutes);

// Connexion MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Base de données connectée"))
  .catch((err) => console.log("❌ Erreur DB :", err));

// Lancer serveur
app.listen(3000, () => {
  console.log("🚀 Serveur lancé sur http://localhost:3000");
});