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
const getAllProfessions = async (req, res) => {
  try {
    console.log("000000000000000000");
    const professions = await Profession.find().populate({
      path: "professionals",
      select: "email",
    });

    res.status(200).json(professions);
  } catch (error) {
    console.error("Error fetching professions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const deleteProfession = async (req, res) => {
  try {
    const professionId = req.params.id;

    // Find the profession by its ID and delete it
    const deletedProfession = await Profession.findByIdAndDelete(professionId);

    if (!deletedProfession) {
      return res.status(404).json({ error: "Profession not found." });
    }

    res.json({ message: "Profession deleted successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the profession." });
  }
};
module.exports = {
  addprofession,
  getAllProfessions,
  deleteProfession,
};
