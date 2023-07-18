const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");

const app = express();
const port = 4000;

// Enable CORS to allow cross-origin requests from your React app
app.use(cors());

// Set up storage for uploaded videos using multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + extension);
  },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.send("Hello World.");
});

// Route to handle video upload
app.post("/api/upload", upload.single("video"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No video file received." });
  }

  // Process the uploaded file here using FFmpeg
  const inputFilePath = req.file.path;
  const outputFilePath = "uploads/output/processed-" + req.file.filename; // Save to /uploads/output directory

  ffmpeg(inputFilePath)
    .videoFilter("negate") // Apply the "negate" filter to invert colors
    .output(outputFilePath)
    .on("end", () => {
      console.log("Video processing complete.");
      // You can save the processed video file path to the database here if needed.
      res.json({ message: "Video uploaded and processed successfully." });
    })
    .on("error", (err) => {
      console.error("Error processing video:", err.message);
      res.status(500).json({ error: "Error processing video." });
    })
    .run();

  // Remember to handle any errors and clean up temporary files as needed.
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
