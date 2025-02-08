const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./config.json");
const { authenticateToken } = require("./utilities");
const User = require("./models/user.model");
const Note = require("./models/note.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());

mongoose
  .connect(config.connectionString)
  .then(() => console.log("MongoDB Connected"));

app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.json({ data: "Hello world" });
});

// Create Account
app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({
      error: true,
      message: "Full Name, Email, and Password are required",
    });
  }

  const isUser = await User.findOne({ email });
  if (isUser) {
    return res.status(400).json({
      error: true,
      message: "User already exists",
    });
  }

  const user = new User({ fullName, email, password });
  await user.save();

  const accessToken = jwt.sign(
    { _id: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "36000m" }
  );

  return res.json({
    error: false,
    user,
    accessToken,
    message: "Registration Successful",
  });
});

// Login User
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and Password are required" });
  }

  const userInfo = await User.findOne({ email });
  if (!userInfo || userInfo.password !== password) {
    return res.status(400).json({
      error: true,
      message: "Invalid Credentials",
    });
  }

  const accessToken = jwt.sign(
    { _id: userInfo._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "36000m" }
  );

  return res.json({
    error: false,
    email,
    message: "Login Successful",
    accessToken,
  });
});

// Get User
app.get("/get-user", authenticateToken, async (req, res) => {
  const isUser = await User.findById(req.user._id);
  if (!isUser) return res.sendStatus(401);

  return res.json({
    user: {
      fullName: isUser.fullName,
      email: isUser.email,
      _id: isUser._id,
      createdOn: isUser.createdOn,
    },
  });
});

// Add a Note
app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;

  if (!title || !content) {
    return res
      .status(400)
      .json({ error: true, message: "Title and Content are required" });
  }

  try {
    const note = new Note({
      title,
      content,
      tags: Array.isArray(tags) ? tags : [], // Ensure tags is an array
      userId: req.user._id,
    });

    await note.save();
    res.json({ error: false, note, message: "Note saved successfully" });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Edit a Note
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const { noteId } = req.params;
  const { title, content, tags, isPinned } = req.body;

  if (!title && !content && !tags && isPinned === undefined) {
    return res
      .status(400)
      .json({ error: true, message: "No changes provided" });
  }

  try {
    const note = await Note.findOne({ _id: noteId, userId: req.user._id });
    if (!note) {
      return res.status(400).json({ error: true, message: "Note not found" });
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned !== undefined) note.isPinned = isPinned;

    await note.save();
    return res.json({ error: false, note, message: "Successfully updated" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
});

// Get all Notes
app.get("/get-all-notes", authenticateToken, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user._id }).sort({
      isPinned: -1,
    });
    return res.json({
      error: false,
      notes,
      message: "All notes retrieved successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
});

// Delete a Note
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  const { noteId } = req.params;

  try {
    const note = await Note.findOne({ _id: noteId, userId: req.user._id });
    if (!note) {
      return res.status(400).json({ error: true, message: "Note not found" });
    }

    await Note.deleteOne({ _id: noteId });
    return res.json({ error: false, message: "Note deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
});

// Update isPinned
app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
  const { noteId } = req.params;
  const { isPinned } = req.body;

  try {
    const note = await Note.findOne({ _id: noteId, userId: req.user._id });
    if (!note) {
      return res.status(400).json({ error: true, message: "Note not found" });
    }

    note.isPinned = isPinned;
    await note.save();

    return res.json({ error: false, note, message: "Successfully updated" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
});

// Search Notes
app.get("/search-notes", authenticateToken, async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res
      .status(400)
      .json({ error: false, message: "Search query is required" });
  }
  try {
    // Get the user's id from req.user
    const userId = req.user._id;

    const matchingNotes = await Note.find({
      userId: userId, // Use the user's id from the token
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
      ],
    });
    return res.json({
      error: false,
      notes: matchingNotes,
      message: "Notes matching the search query retrieved",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server Error",
    });
  }
});

// app.get("/notes", async (req, res) => {
//   try {
//     const notes = await Note.find(); // If using MongoDB
//     res.json({ success: true, notes });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Error fetching notes" });
//   }
// });

app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});
