const { nanoid } = require("nanoid");
const Link = require("../models/Link");

// Vérifier URL
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Créer lien court
exports.createShortUrl = async (req, res) => {
  const { url } = req.body;

  if (!url || !isValidUrl(url)) {
    return res.status(400).json({ error: "URL invalide" });
  }

  try {
    const code = nanoid(6);

    const newLink = await Link.create({
      originalUrl: url,
      shortCode: code,
    });

    res.json({
      shortUrl: `${req.protocol}://${req.get("host")}/${code}`,
    });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Redirection
exports.redirect = async (req, res) => {
  try {
    const link = await Link.findOne({ shortCode: req.params.code });

    if (!link) {
      return res.status(404).send("Lien introuvable");
    }

    link.clicks++;
    await link.save();

    res.redirect(link.originalUrl);
  } catch (err) {
    res.status(500).send("Erreur serveur");
  }
};