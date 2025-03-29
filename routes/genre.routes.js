import express from "express";
import db from "../models/index.js";

const router = express.Router();
const Genre = db.Genre;

router.get("/", async (req, res) => {
  try {
    const genres = await Genre.find().sort({ name: 1 });
    
    res.json({
      success: true,
      data: genres
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router; 