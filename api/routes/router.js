const express = require("express");
const upload = require("../config/multer");
const {
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
} = require("../controllers/userController");
const {
  addprofession,
  getAllProfessions,
  deleteProfession,
} = require("../controllers/professionController");
const {
  requestproject,
  accepteProject,
  canceleProject,
  rejectProject,
  addMessage,
  getMessages,
  getUserDiscussions,
  getProfessionalDiscussions,
} = require("../controllers/projectController");
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

router.post("/addprofessions", addprofession);
router.get("/getAllProfessions", getAllProfessions);
router.delete("/deleteprofessions/:id", deleteProfession);
router.put("/addRatings", addRatings);
router.put("/deleteRatings", deleteRatings);

/////////////////////////////prjects//////////////////
router.post("/requestproject", requestproject);
router.post("/accepteProject", accepteProject);
router.post("/canceleProject", canceleProject);
router.post("/rejectProject", rejectProject);
router.post("/addMessage", upload.single("photo"), addMessage);
router.get("/getMessages/:discussionId", getMessages);
router.get("/getUserDiscussions/:userId", getUserDiscussions);
router.get(
  "/getProfessionalDiscussions/:professionalId",
  getProfessionalDiscussions
);

module.exports = router;
