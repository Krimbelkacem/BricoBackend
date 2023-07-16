const Profession = require("../models/profession");

const addprofession = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if the profession already exists
    const existingProfession = await Profession.findOne({ name });
    if (existingProfession) {
      return res.status(400).json({ error: "Profession already exists" });
    }

    const profession = new Profession({ name });
    await profession.save();

    res.status(201).json(profession);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports = {
  addprofession,
};
