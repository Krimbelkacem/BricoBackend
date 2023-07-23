const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");
const Profession = require("./profession");

const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    username: {
      default: "Brico_Pro User",
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
    picture: {
      type: "String",

      default: "default.jpg",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    archived: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
    },
    address: {
      type: String,
    },
    // Add a reference to requested projects
    requestedProjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
  },
  { timestamps: true }
);
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

const User = mongoose.model("User", userSchema);

// Professional Schema (inherits from User Schema)
const professionalSchema = new mongoose.Schema({
  profession: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profession",
  },
  experience: Number,
  // Add a reference to managed projects
  managedProjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
  ],
  // Other professional-specific fields
});

const Professional = User.discriminator("Professional", professionalSchema);

module.exports = { User, Professional };
