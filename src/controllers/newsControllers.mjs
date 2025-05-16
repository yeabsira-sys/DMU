import { News } from "../models/News.mjs";
import fs from "fs/promises";

export const newsPostController = async (req, res) => {
  try {
    let newsData = (({
      title,
      content,
      description,
      author,
      isHidden,
      socialMediaPosted,
      strong,
    }) => ({
      title,
      content,
      description,
      author,
      isHidden,
      socialMediaPosted,
      strong,
    }))(req.body);

    const fileData = await fs.readFile("imagefile.json", "utf-8");
    const images = await JSON.parse(fileData);
    console.log(images)
    const postedBy = req.user.id || newsData.author;
    newsData = {
      ...newsData,
      images: images,
      postedBy,
    };
    const news = await News.create(newsData);
    if (!news) {
      // once the news could not be updated delete the images that uploads before
      return res.status(400).json({
        message: "news could not be upload",
      });
    }
    res.status(201).json({ payload: news });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "news could not be upload, enternal server error" });
  }
};

// CREATE news
export const createNews = async (req, res) => {
  try {
    const newsData = req.body;
    const news = new News(newsData);
    await news.save();
    res.status(201).json(news);
  } catch (err) {
    console.error("Create News Error:", err);
    res.status(500).json({ error: "Failed to create news" });
  }
};

// GET all news with pagination & excluding hidden ones
export const getAllNews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [news, total] = await Promise.all([
      News.find({ isHidden: false })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate("postedBy editedBy"),
      News.countDocuments({ isHidden: false }),
    ]);

    res.status(200).json({
      total,
      page,
      pageSize: news.length,
      news,
    });
  } catch (err) {
    console.error("Get All News Error:", err);
    res.status(500).json({ error: "Failed to fetch news" });
  }
};

// GET news by ID
export const getNewsById = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findOne({ _id: id, isHidden: false }).populate(
      "postedBy editedBy"
    );
    if (!news) return res.status(404).json({ error: "News not found" });
    res.status(200).json(news);
  } catch (err) {
    console.error("Get News By ID Error:", err);
    res.status(500).json({ error: "Failed to fetch news" });
  }
};

// UPDATE news
export const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    updatedData.editedAt = new Date();

    const updatedNews = await News.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedNews) return res.status(404).json({ error: "News not found" });
    res.status(200).json(updatedNews);
  } catch (err) {
    console.error("Update News Error:", err);
    res.status(500).json({ error: "Failed to update news" });
  }
};

// SOFT DELETE news (set isHidden: true)
export const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await News.findByIdAndUpdate(
      id,
      { isHidden: true },
      { new: true }
    );
    if (!deleted) return res.status(404).json({ error: "News not found" });
    res
      .status(200)
      .json({ message: "News hidden (soft deleted) successfully" });
  } catch (err) {
    console.error("Delete News Error:", err);
    res.status(500).json({ error: "Failed to delete news" });
  }
};
