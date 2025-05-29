import { Announcement } from "../models/Announcement.mjs";
import { Event } from '../models/Events.mjs'
import { News} from '../models/News.mjs'
import { Admission } from '../models/Admission.mjs'
import { JobOpening } from '../models/Job.mjs'
import axios from "axios";
import { queueBatchEmails } from "../queues/emailJob.mjs";

import { ObjectId } from "mongodb";

// CREATE
export const createAnnouncement = async (req, res) => {
  try {
    if(req.user.role !== 'admin' && req.user.role !== 'cda') return res.status(401).json({message: 'unauthorized'})
      const{ title, type, description, department, targetAudience, endDate, startDate, applicationLink, location, contactInfo, attachment, relatedId, status, tags, isHidden, socialMediaPosted} = req.body
    if(relatedId && ObjectId.isValid(relatedId)){

      switch(type){
        case 'admission':
          const isExist = Admission.exists({_id: new ObjectId(relatedId)})
          if(!isExist) return res.status(400).json({message:  `there is no admission program, make sure to announce the admission or post it as other`})

          break;
        case 'event':
          const isEventExist = Event.exists({_id: new ObjectId(relatedId)})
          if(!isEventExist) return res.status(400).json({message:  `there is no event, make sure to announce the event or post it as other`})
        case 'news':
          const isNewsExist = News.exists({_id: new ObjectId(relatedId)})
          if(!isNewsExist) return res.status(400).json({message:  `there is no news, make sure to announce the news or post it as other`})
        case 'jobopening':
          const isJobOpeningExist = JobOpening.exists({_id: new ObjectId(relatedId)})
          if(!isJobOpeningExist) return res.status(400).json({message:  `there is no job opening, make sure to announce the job opening or post it as other`})
      }
    }
      const announcementData = {
        title, type, description, department, targetAudience, endDate, startDate, applicationLink, location, contactInfo, attachment, relatedId, status, tags, isHidden, socialMediaPosted
      }
    const announcement = await Announcement.create({
      ...announcementData,
      postedBy: req.user?.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    });
    if(!announcement) return res.status(400).json({ success: false, message: "Announcement creation failed" });  
        try {
                  axios.post(
        'http://localhost:4080/new-content-to-post',
        {
          title: announcement.title,
          description: announcement.description,
          postTo: announcement.socialMediaPosted,
          tags: ['DMU', 'News', 'University', 'Addis_Ababa_university', 'Ethiopia'],
          link: `http://localhost:3500/announcement`,
          images: []
        }
      );
        } catch (error) {
          console.error('TELEGRAM POST ERROR : ',error)
        }
        try {
          const subject = `${announcement.title} `
          const html = `<h4> ${announcement.description} </h4>`
         await queueBatchEmails({subject, html})
        } catch (error) {
          console.error('MASS EMAILER ERROR : ', error)
        }
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
    if(req.user.role !== 'admin' && req.user.role !== 'cda') return res.status(401).json({message: 'unauthorized'})
          const { id } = req.params;
    if (id && ObjectId.isValid(id)){
      const isAnnouncementExist = await Announcement.findById(id)
      if (!isAnnouncementExist) return res.status(404).json({ success: false, message: "Announcement not found" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid announcement ID" }); 
    }
      const { title, description, department, targetAudience, endDate, startDate, applicationLink, location, contactInfo, attachment, status, tags, isHidden } = req.body;
    const updateAnnouncementData ={}
    title? updateAnnouncementData.title = title : null
    description? updateAnnouncementData.description = description : null
    department? updateAnnouncementData.department = department : null
    targetAudience? updateAnnouncementData.targetAudience = targetAudience : null
    endDate? updateAnnouncementData.endDate = endDate : null
    startDate? updateAnnouncementData.startDate = startDate : null
    applicationLink? updateAnnouncementData.applicationLink = applicationLink : null
    location? updateAnnouncementData.location = location : null
    contactInfo? updateAnnouncementData.contactInfo = contactInfo : null
    attachment? updateAnnouncementData.attachment = attachment : null
    status? updateAnnouncementData.status = status : null
    tags? updateAnnouncementData.tags = tags : null
    isHidden? updateAnnouncementData.isHidden = isHidden : null
    if (Object.keys(updateAnnouncementData).length === 0)
      return res.status(400).json({ success: false, message: "No fields to update" });

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
     if(req.user.role !== 'admin' && req.user.role !== 'cda') return res.status(401).json({message: 'unauthorized'})
      const { id } = req.params;
    if (id && ObjectId.isValid(id)){
      const isAnnouncementExist = await Announcement.findById(id)
      if (!isAnnouncementExist) return res.status(404).json({ success: false, message: "Announcement not found" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid announcement ID" }); 
    }
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
    if(req.user.role !== 'admin' && req.user.role !== 'cda') return res.status(401).json({message: 'unauthorized'})
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
    if(req.user.role !== 'admin' && req.user.role !== 'cda') return res.status(401).json({message: 'unauthorized'})
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
    if(req.user.role !== 'admin' && req.user.role !== 'cda') return res.status(401).json({message: 'unauthorized'})

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