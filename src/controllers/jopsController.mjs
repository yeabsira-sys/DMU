import { JobOpening } from "../models/Job.mjs";
import { ObjectId } from "mongodb";

// CREATE
export const createJob = async (req, res) => {
  try {
    const { title, department, jobType, jobLevel, requiredQualifications, preferredQualifications, experienceRequired , applicationDeadline, postingDate, salaryRange, location, applicationProcess, applicationLink, documentsRequired, contactEmail, jobReferenceCode,equalOpportunityStatement, isHidden} = req.body;
    const createdBy = req.user?.id;
    const jopsData = {
        title,
        department,
        jobType,
        jobLevel,
        requiredQualifications,
        preferredQualifications,
        experienceRequired,
        applicationDeadline,
        postingDate,
        salaryRange,
        location,
        applicationProcess,
        applicationLink,
        documentsRequired,
        contactEmail,
        jobReferenceCode,
        equalOpportunityStatement,
        isHidden,
        createdBy,

    }
    const job = await JobOpening.create({
      ...jopsData,
    });
    res.status(201).json({ success: true, payload: job });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// FILTER & PAGINATION
export const filterJobs = async (req, res) => {
  try {
    const {
      title,
      department,
      jobType,
      jobLevel,
      isHidden,
      fromDate,
      toDate,
      limit = 10,
      page = 1,
    } = req.query;

    let filter = { isDeleted: { $ne: true }, isHidden: false };
    if (title) filter.title = { $regex: title, $options: "i" };
    if (department) filter.department = { $regex: department, $options: "i" };
    if (jobType) filter.jobType = jobType;
    if (jobLevel) filter.jobLevel = jobLevel;
    if (typeof isHidden !== "undefined") filter.isHidden = isHidden === "true";
    if (fromDate || toDate) {
      filter.createdAt = {};
      if (fromDate) filter.createdAt.$gte = new Date(fromDate);
      if (toDate) filter.createdAt.$lte = new Date(toDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const jobs = await JobOpening.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    const total = await JobOpening.countDocuments(filter);

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
      jobs,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// READ BY ID
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid job ID" });
    const job = await JobOpening.findOne({ _id: id, isDeleted: { $ne: true }, isHidden: false });
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    res.status(200).json({ success: true, payload: job });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// UPDATE
export const updateJob = async (req, res) => {
  try {
        const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid job ID" });
    const { title, department, jobType, jobLevel, requiredQualifications, preferredQualifications, experienceRequired , applicationDeadline, postingDate, salaryRange, location, applicationProcess, applicationLink, documentsRequired, contactEmail, jobReferenceCode,equalOpportunityStatement, isHidden} = req.body;
    const updatedJopsData = {}
        title? updatedJopsData.title = title : null
        department? updatedJopsData.department = department : null
        jobType? updatedJopsData.jobType = jobType : null
        jobLevel? updatedJopsData.jobLevel = jobLevel : null
        requiredQualifications? updatedJopsData.requiredQualifications = requiredQualifications : null
        preferredQualifications? updatedJopsData.preferredQualifications = preferredQualifications : null
        experienceRequired? updatedJopsData.experienceRequired = experienceRequired : null
        applicationDeadline? updatedJopsData.applicationDeadline = applicationDeadline : null
        postingDate? updatedJopsData.postingDate = postingDate : null
        salaryRange? updatedJopsData.salaryRange = salaryRange : null
        location? updatedJopsData.location = location : null
        applicationProcess? updatedJopsData.applicationProcess = applicationProcess : null
        applicationLink? updatedJopsData.applicationLink = applicationLink : null
        documentsRequired? updatedJopsData.documentsRequired = documentsRequired : null
        contactEmail? updatedJopsData.contactEmail = contactEmail : null
        jobReferenceCode? updatedJopsData.jobReferenceCode = jobReferenceCode : null
        equalOpportunityStatement? updatedJopsData.equalOpportunityStatement = equalOpportunityStatement : null
        isHidden
        updatedJopsData.updatedBy = req.user?.id
        updatedJopsData.updatedAt = new Date()

    const updatedJob = await JobOpening.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true } },
      { updatedJopsData },
      { new: true }
    );
    if (!updatedJob) return res.status(404).json({ success: false, message: "Job not found" });
    res.status(200).json({ success: true, payload: updatedJob });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// SOFT DELETE
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid job ID" });
    const deleted = await JobOpening.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true } },
      { isDeleted: true, updatedAt: new Date(), updatedBy: req.user?.id },
      { new: true }
    );
    if (!deleted) return res.status(404).json({ success: false, message: "Job not found" });
    res.status(200).json({ success: true, message: "Job deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getHiddenJobs = async (req, res) => {
    try {
      const { limit = 10, page = 1 } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const filter = { isDeleted: { $ne: true } };
      const jobs = await JobOpening.find(filter)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));
      const total = await JobOpening.countDocuments(filter);
      res.status(200).json({
        success: true,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
        jobs,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  export const toggleJobIsHidden = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid job ID" });

    const job = await JobOpening.findById(id);
    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });

    job.isHidden = !job.isHidden;
    job.updatedAt = new Date();
    job.updatedBy = req.user?.id;
    await job.save();

    res.status(200).json({
      success: true,
      message: `Job isHidden set to ${job.isHidden}`,
      payload: job,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};