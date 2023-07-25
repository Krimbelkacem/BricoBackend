const { User, Professional } = require("../models/user");
const { generateToken } = require("../config/token");
const Profession = require("../models/profession");
/*const addusers = async (req, res) => {
  try {
    const user = new User(req.body);
    // Check if a file was uploaded
    if (req.file) {
      user.picture = req.file.filename; // Assign the uploaded file's filename to the user's picture field
    }

    // Generate token for the newly created user
    const token = generateToken(user._id);

    // Save the token in the user document and save the document
    user.token = token;
    await user.save();

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
*/

const addusers = async (req, res) => {
  try {
    // Check if the request body contains the "profession" field
    if (req.body.profession) {
      // If the "profession" field is present, create and save a Professional user
      const professional = new Professional(req.body);
      // Check if a file was uploaded
      if (req.file) {
        professional.picture = req.file.filename; // Assign the uploaded file's filename to the user's picture field
      }

      // Generate token for the newly created professional
      const token = generateToken(professional._id);

      // Save the token in the professional document and save the document
      professional.token = token;
      await professional.save();
      console.log("prestataire updated");
      const updatedProfession = await Profession.findOneAndUpdate(
        { _id: req.body.profession },
        { $push: { professionals: professional._id } },
        { new: true }
      );

      if (!updatedProfession) {
        console.log("profession updated");
        return res.status(404).json({ error: "Profession not found" });
      }

      res.status(201).json({ professional, token });
    } else {
      // If the "profession" field is not present, create and save a regular User
      const user = new User(req.body);

      // Check if a file was uploaded
      if (req.file) {
        user.picture = req.file.filename; // Assign the uploaded file's filename to the user's picture field
      }

      // Generate token for the newly created user
      const token = generateToken(user._id);

      // Save the token in the user document and save the document
      user.token = token;
      await user.save();

      res.status(201).json({ user, token });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const profilusers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("requestedProjects")
      .populate("managedProjects")
      .exec();
    if (!user) throw new Error("User not found");
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
const allusers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const updateusers = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) throw new Error("User not found");
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
const deleteusers = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) throw new Error("User not found");
    res.sendStatus(204);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
const addprofessionals = async (req, res) => {
  try {
    const professional = new Professional(req.body);

    // Generate token for the newly created professional
    const token = generateToken(professional._id);

    // Save the token in the professional document and save the document
    professional.token = token;
    await professional.save();

    res.status(201).json({ professional, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const allprofessionals = async (req, res) => {
  try {
    const professionals = await Professional.find();
    res.json(professionals);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const profilprofessionals = async (req, res) => {
  try {
    const professional = await Professional.findById(req.params.id);
    if (!professional) throw new Error("Professional not found");
    res.json(professional);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const updateprofessionals = async (req, res) => {
  try {
    const professional = await Professional.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!professional) throw new Error("Professional not found");
    res.json(professional);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
const deleteprofessionals = async (req, res) => {
  try {
    const professional = await Professional.findByIdAndDelete(req.params.id);
    if (!professional) throw new Error("Professional not found");
    res.sendStatus(204);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

///////////////////// authentification /////////////
const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user or professional based on the provided email
    const authenticatedUser = await User.findOne({ email });

    // If no user or professional is found or the password doesn't match, return an error
    if (
      !authenticatedUser ||
      !(await authenticatedUser.matchPassword(password))
    ) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Determine the role based on the discriminator field (__t)
    const role =
      authenticatedUser.__t === "Professional" ? "professional" : "user";

    // Generate a token for the authenticated user
    const token = generateToken(authenticatedUser._id);

    // Update the authenticated user's token and save the document
    authenticatedUser.token = token;
    await authenticatedUser.save();

    // Return the authenticated user object, role, and token in the response
    res.json({ user: authenticatedUser, role, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const addRatings = async (req, res) => {
  try {
    const { id } = req.query;
    const { rating } = req.body;

    // Validate rating value
    if (rating < 0 || rating > 5) {
      return res.status(400).json({
        message: "Invalid rating value. It should be between 0 and 5.",
      });
    }

    // Find the professional by ID
    const professional = await Professional.findByIdAndUpdate(
      id,
      { rating },
      { new: true }
    );

    if (!professional) {
      return res.status(404).json({ message: "Professional not found." });
    }

    return res.status(200).json({
      message: "Rating added successfully.",
      rating: professional.rating,
    });
  } catch (error) {
    console.error("Error adding rating:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
const deleteRatings = async (req, res) => {
  try {
    const { id } = req.query;

    // Find the professional by ID
    const professional = await Professional.findByIdAndUpdate(
      id,
      { $unset: { rating: 1 } },
      { new: true }
    );

    if (!professional) {
      return res.status(404).json({ message: "Professional not found." });
    }

    return res.status(200).json({ message: "Rating deleted successfully." });
  } catch (error) {
    console.error("Error deleting rating:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  addRatings,
  deleteRatings,
  addusers,
  allusers,
  profilusers,
  updateusers,
  deleteusers,
  addprofessionals,
  allprofessionals,
  profilprofessionals,
  updateprofessionals,
  deleteprofessionals,
  signIn,
};
