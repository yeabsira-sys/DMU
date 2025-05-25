import { Announcement } from "../models/Announcement.mjs";
import { ObjectId } from "mongodb";

// CREATE
export const createAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.create({
      ...req.body,
      postedBy: req.user?.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    });
    res.status(201).json({ success: true, payload: announcement });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// FILTER, PAGINATION, SEARCH
export const filterAnnouncements = async (req, res) => {
  try {
    const {
      title,
      type,
      department,
      status,
      isHidden,
      isDeleted,
      fromDate,
      toDate,
      limit = 10,
      page = 1,
    } = req.query;

    let filter = {};
    if (title) filter.title = { $regex: title, $options: "i" };
    if (type) filter.type = type;
    if (department) filter.department = { $regex: department, $options: "i" };
    if (status) filter.status = status;
    if (typeof isHidden !== "undefined") filter.isHidden = isHidden === "true";
    if (typeof isDeleted !== "undefined") filter.isDeleted = isDeleted === "true";
    if (fromDate || toDate) {
      filter.createdAt = {};
      if (fromDate) filter.createdAt.$gte = new Date(fromDate);
      if (toDate) filter.createdAt.$lte = new Date(toDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const announcements = await Announcement.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    const total = await Announcement.countDocuments(filter);

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
      announcements,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET BY ID
export const getAnnouncementById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid announcement ID" });
    const announcement = await Announcement.findById(id);
    if (!announcement)
      return res.status(404).json({ success: false, message: "Announcement not found" });
    res.status(200).json({ success: true, payload: announcement });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// UPDATE
export const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid announcement ID" });
    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: new Date(), updatedBy: req.user?.id },
      { new: true }
    );
    if (!updatedAnnouncement)
      return res.status(404).json({ success: false, message: "Announcement not found" });
    res.status(200).json({ success: true, payload: updatedAnnouncement });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// SOFT DELETE
export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid announcement ID" });
    const deleted = await Announcement.findByIdAndUpdate(
      id,
      { isDeleted: true, updatedAt: new Date(), updatedBy: req.user?.id },
      { new: true }
    );
    if (!deleted)
      return res.status(404).json({ success: false, message: "Announcement not found" });
    res.status(200).json({ success: true, message: "Announcement deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ADMIN: GET HIDDEN/DELETED ANNOUNCEMENTS
export const getHiddenAnnouncements = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const filter = { isHidden: true, isDeleted: false };
    const announcements = await Announcement.find(filter)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    const total = await Announcement.countDocuments(filter);
    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
      announcements,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getDeletedAnnouncements = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const filter = { isDeleted: true };
    const announcements = await Announcement.find(filter)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    const total = await Announcement.countDocuments(filter);
    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
      announcements,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// TOGGLE isHidden
export const toggleAnnouncementIsHidden = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid announcement ID" });

    const announcement = await Announcement.findById(id);
    if (!announcement)
      return res.status(404).json({ success: false, message: "Announcement not found" });

    announcement.isHidden = !announcement.isHidden;
    announcement.updatedAt = new Date();
    announcement.updatedBy = req.user?.id;
    await announcement.save();

    res.status(200).json({
      success: true,
      message: `Announcement isHidden set to ${announcement.isHidden}`,
      payload: announcement,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};