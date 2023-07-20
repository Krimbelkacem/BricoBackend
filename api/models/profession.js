const mongoose = require("mongoose");

const professionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  professionals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Professional",
    },
  ],
});

const Profession = mongoose.model("Profession", professionSchema);

module.exports = Profession;
