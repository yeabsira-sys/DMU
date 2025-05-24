import { Statistics } from "../../models/universityData/statistics.mjs";
import { ObjectId } from "mongodb";

// CREATE
export const createStatistic = async (req, res) => {
  try {
    const { name, amount, description, isHidden } = req.body;
    const createdBy = req.user?.id;
    const statistic = {
      name,
      amount,
      description,
      isHidden,
      createdBy,
    };
    const newStatistic = await Statistics.create(statistic);
    if (!newStatistic)
      return res.status(400).json({ message: "Statistic could not be created" });
    res.status(201).json({ message: "Statistic created", data: newStatistic });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ ALL
export const getAllStatistics = async (req, res) => {
  try {
    const statistics = await Statistics.find({});
    if (!statistics || statistics.length === 0)
      return res.status(404).json({ message: "No statistics found" });
    res.status(200).json({ payload: statistics });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ BY ID
export const getStatisticById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid statistic ID" });
    const statistic = await Statistics.findById(id);
    if (!statistic)
      return res.status(404).json({ message: `No statistic found with id: ${id}` });
    res.status(200).json({ payload: statistic });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
export const updateStatistic = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid statistic ID" });
    const { name, amount, description, isHidden } = req.body;
    let updateData = {};
    if (name) updateData.name = name;
    if (amount) updateData.amount = amount;
    if (description) updateData.description = description;
    if (typeof isHidden !== "undefined") updateData.isHidden = isHidden;
    updateData.updatedAt = new Date();
    updateData.updatedBy = req.user?.id;
    const updatedStatistic = await Statistics.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );
    if (!updatedStatistic)
      return res.status(404).json({ message: "Statistic not found" });
    res.status(200).json({ message: "Statistic updated", data: updatedStatistic });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE
export const deleteStatistic = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid statistic ID" });
    const deleted = await Statistics.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ message: "Statistic not found" });
    res.status(200).json({ message: "Statistic deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};