require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { nanoid } = require("nanoid");

const app = express();

// =======================
// MIDDLEWARE
// =======================
app.use(express.json());
app.use(cors());

// Sert les fichiers statiques (frontend)
app.use(express.static("public"));

// =======================
// MONGODB CONNECTION
// =======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connecté"))
  .catch((err) => console.error("❌ MongoDB erreur :", err));

// =======================
// MODEL
// =======================
const LinkSchema = new mongoose.Schema({
  originalUrl: String,
  shortCode: String,
});

const Link = mongoose.model("Link", LinkSchema);

// =======================
// HOME PAGE
// =======================
app.get("/", (req, res) => {
  res.send("OK");
});

// =======================
// CREATE SHORT LINK
// =======================
app.post("/shorten", async (req, res) => {
  try {
    const { originalUrl, customCode } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ error: "URL manquante" });
    }

    const code = customCode || nanoid(6);

    const exists = await Link.findOne({ shortCode: code });
    if (exists) {
      return res.status(400).json({ error: "Code déjà utilisé" });
    }

    const newLink = new Link({
      originalUrl,
      shortCode: code,
    });

    await newLink.save();

    res.json({
      shortUrl: `${req.protocol}://${req.get("host")}/${code}`,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// =======================
// REDIRECT LINK
// =======================
app.get("/:code", async (req, res) => {
  try {
    const link = await Link.findOne({ shortCode: req.params.code });

    if (!link) {
      return res.status(404).send("Lien introuvable");
    }

    res.redirect(link.originalUrl);

  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
});

// =======================
// START SERVER
// =======================
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Serveur lancé sur ${PORT}`);
});