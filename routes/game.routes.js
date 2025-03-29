import express from "express";

import db from "../models/index.js";

const router = express.Router();
const Game = db.Game;
const Genre = db.Genre;

router.get("/", async (req, res) => {
    console.log("req.query", req.query);
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    
    const query = {};
    
    if (req.query.genre) {
      if (typeof req.query.genre === 'string') {
        const genre = await Genre.findOne({ name: req.query.genre.toUpperCase() });
        if (genre) {
          query.genre = genre._id;
        }
      } else {
        query.genre = req.query.genre;
      }
    }
    
    if (req.query.inTop) {
      query.inTop = req.query.inTop === 'true';
    }
    
    if (req.query.search) {
      query.commonGameName = { $regex: req.query.search, $options: 'i' };
    }

    const [games, total] = await Promise.all([
      Game.find(query)
        .populate('genre')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Game.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: games,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router; 