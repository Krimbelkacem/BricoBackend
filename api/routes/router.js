const express = require("express");
const upload = require("../config/multer");
const {
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
} = require("../controllers/userController");
const { addprofession } = require("../controllers/professionController");
const router = express();

router.post("/addusers", upload.single("picture"), addusers);

// Read all users
router.get("/allusers", allusers);

// Read a specific user
router.get("/profilusers/:id", profilusers);

// Update a user
router.put("/updateusers/:id", updateusers);

// Delete a user
router.delete("/deleteusers/:id", deleteusers);

// Professional CRUD Routes

// Create a new professional
router.post("/addprofessionals", addprofessionals);

// Read all professionals
router.get("/allprofessionals", allprofessionals);

// Read a specific professional
router.get("/profilprofessionals/:id", profilprofessionals);

// Update a professional
router.put("/updateprofessionals/:id", updateprofessionals);

// Delete a professional
router.delete("/deleteprofessionals/:id", deleteprofessionals);
router.post("/signIn", signIn);

///////////////////////////////  proffession///////////////////////////////////////////

router.post("/professions", addprofession);
module.exports = router;
