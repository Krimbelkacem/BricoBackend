const Project = require("../models/project");
const { User, Professional } = require("../models/user");
const Discussion = require("../models/discussion");

const requestproject = async (req, res) => {
  console.log("debut demande");
  const {
    userId,
    professionalId,
    subject,
    description,
    dateBegin,
    dateFinish,
  } = req.body;
  console.log(
    userId,
    professionalId,
    subject,
    description,
    dateBegin,
    dateFinish
  );
  try {
    // Find the user and professional
    const user = await User.findById(userId);
    const professional = await Professional.findById(professionalId);

    if (!user || !professional) {
      return res
        .status(404)
        .json({ message: "User or professional not found." });
    }

    // Create a new project
    const projectData = {
      user: user._id,
      professional: professional._id,
      subject,
      description,
      dateBegin,
      dateFinish,
      status: "pending",
    };

    const newProject = await Project.create(projectData);

    // Update user's requestedProjects
    user.requestedProjects.push(newProject._id);
    await user.save();

    // Update professional's managedProjects
    professional.managedProjects.push(newProject._id);
    await professional.save();

    return res.status(201).json({
      message: "Project request sent successfully.",
      project: newProject,
    });
  } catch (error) {
    console.error("Error sending project request:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

const accepteProject = async (req, res) => {
  console.log("3333333333333333333333333");
  try {
    const project = await Project.findById(req.query.projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    project.status = "accepted";
    await project.save();

    // Create a new discussion
    const discussion = new Discussion({
      project: project._id,
      user: project.user,
      professional: project.professional,
      messages: [], // You can add initial messages if needed
    });
    await discussion.save();

    return res.status(200).json(project);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
const canceleProject = async (req, res) => {
  console.log("22222222222222222222222");
  console.log(req.query.projectId);
  try {
    const project = await Project.findById(req.query.projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    project.status = "canceled";
    await project.save();

    return res.status(200).json(project);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
const rejectProject = async (req, res) => {
  try {
    const project = await Project.findById(req.query.projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    project.status = "rejected";
    await project.save();

    return res.status(200).json(project);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
const addMessage = async (req, res) => {
  const discussionId = req.query.discussionId;
  const { sender, text } = req.body;

  try {
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ error: "Discussion not found" });
    }

    let photoUrl = null;
    if (req.file) {
      // Assuming multer is set up to store uploaded files in a "uploads" folder.
      photoUrl = `${req.file.filename}`;
    }

    const newMessage = {
      sender,
      content: {
        text,
        photoUrl,
      },
      timestamp: Date.now(),
    };

    discussion.messages.push(newMessage);
    await discussion.save();

    return res.status(200).json(discussion);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getMessages = async (req, res) => {
  const { discussionId } = req.params;

  try {
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ error: "Discussion not found" });
    }

    return res.status(200).json(discussion.messages);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
const getUserDiscussions = async (req, res) => {
  const userId = req.params.userId;

  try {
    const discussions = await Discussion.find({ user: userId })
      .populate("user")
      .populate("professional")
      .exec();

    return res.status(200).json(discussions);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
const getProfessionalDiscussions = async (req, res) => {
  const professionalId = req.params.professionalId;

  try {
    const discussions = await Discussion.find({ professional: professionalId })
      .populate("user")
      .populate("professional")
      .exec();

    return res.status(200).json(discussions);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  requestproject,
  accepteProject,
  canceleProject,
  rejectProject,
  addMessage,
  getMessages,
  getUserDiscussions,
  getProfessionalDiscussions,
};
