import { Event } from "../models/Events.mjs";
import { ObjectId } from "mongodb";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { fileExists } from "../utils/isFileExist.mjs";
import { deleteFiles } from "../services/deleteFileService.mjs";
import { findUserByIdentifier } from "../services/getUser.mjs";
import { changeMetadata } from "../services/changeFileMetaData.mjs";
import { removeMatchIds } from "../services/removeMatchIds.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const createEvent = async (req, res) => {
  try {
    if (req.user?.role !== "admin")
      return res.status(403).json({ success: false, message: "Unauthorized" });
    const {
      title,
      eventType,
      description,
      organizer,
      startDateTime,
      endDateTime,
      location,
      registrationRequired,
      registrationLink,
      audience,
      speakers,
      agenda,
      contactInfo,
      category,
      status,
      recurrence,
      socialMediaPosted = [],
    } = req.body;
    const createdBy = req.user?.id;
    const eventData = {
      title,
      eventType,
      description,
      organizer,
      startDateTime,
      endDateTime,
      location,
      registrationRequired,
      registrationLink,
      audience,
      speakers,
      agenda,
      contactInfo,
      category,
      status,
      recurrence,
      createdBy,
      socialMediaPosted,
    };

    const imageFilePath = path.join("imagefile.json");
    let eventImages;
    console.log(imageFilePath);
    if (await fileExists(imageFilePath)) {
      const imageData = await fs.readFile("imagefile.json", "utf8");
      eventImages = JSON.parse(imageData);
      await fs.unlink(imageFilePath);
    } else {
      eventImages = [];
    }
    const event = await Event.create({
      ...eventData,
      createdBy,
      createdAt: new Date(),
      isDeleted: false,
      eventImages,
    });
     const  posterImage = event.map(image => image?.uri)
        try {
                  axios.post(
        'http://localhost:4080/new-content-to-post',
        {
          title: event.title,
          description: event.description,
          postTo: event.socialMediaPosted,
          tags: ['DMU_EVENTS', 'News', 'University', 'Addis_Ababa_university', 'Ethiopia'],
          link: `http://localhost:3500/`,
          images: posterImage? posterImage : [],
        }
      );
        } catch (error) {
          console.error('TELEGRAM POST ERROR : ',error)
        }
        try {
          const subject = `${event.title} `
          const html = `<h3> ${event.description} </h3>`
         await queueBatchEmails({subject, html})
        } catch (error) {
          console.error('MASS EMAILER ERROR : ', error)
        }
    res.status(201).json({ success: true, payload: event });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// FILTER, PAGINATION, SEARCH EVENTS
export const filterEvents = async (req, res) => {
  try {
    const {
      title,
      eventType,
      organizer,
      category,
      status,
      location,
      fromDate,
      toDate,
      limit = 10,
      page = 1,
    } = req.query;

    let filter = { isDeleted: false, isHidden: false };
    if (title) filter.title = { $regex: title, $options: "i" };
    if (eventType) filter.eventType = eventType;
    if (organizer) filter.organizer = { $regex: organizer, $options: "i" };
    if (category) filter.category = { $regex: category, $options: "i" };
    if (status) filter.status = status;
    if (location) filter.location = { $regex: location, $options: "i" };
    if (fromDate || toDate) {
      filter.startDateTime = {};
      if (fromDate) filter.startDateTime.$gte = new Date(fromDate);
      if (toDate) filter.startDateTime.$lte = new Date(toDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const events = await Event.find(filter)
      .sort({ startDateTime: 1 })
      .skip(skip)
      .limit(parseInt(limit));
    const total = await Event.countDocuments(filter);

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
      events,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET EVENT BY ID
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid event ID" });
    const event = await Event.findOne({
      _id: id,
      isDeleted: false,
      isHidden: false,
    });
    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    res.status(200).json({ success: true, payload: event });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// UPDATE EVENT
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid event ID" });
    const {
      title,
      eventType,
      description,
      organizer,
      startDateTime,
      endDateTime,
      location,
      registrationRequired,
      registrationLink,
      audience,
      speakers,
      agenda,
      contactInfo,
      category,
      status,
      recurrence,
      eventImages,
      imageIds,
      imageChanged,
    } = req.body;
    const createdBy = req.user?.id;
    const updatedEventData = {
      title,
      eventType,
      description,
      organizer,
      startDateTime,
      endDateTime,
      location,
      registrationRequired,
      registrationLink,
      audience,
      speakers,
      agenda,
      contactInfo,
      category,
      status,
      recurrence,
      createdBy,
      eventImages,
      updatedAt: new Date(),
      updatedBy: req.user?.id,
    };
if (imageChanged) {
          const imageFilePath = path.join("imagefile.json")
            let images
          if( await fileExists(imageFilePath)){
            const imageData = await fs.readFile('imagefile.json', 'utf-8')
            images = JSON.parse(imageData);
            await fs.unlink(imageFilePath);
          }
          else{
            images = []
          }
               const newImage = await removeMatchIds(imageIds, formerImages, images);
          // console.log(newImage)
          updatedEventData = {
            ...updatedEventData,
            images: newImage,
          };
    
          const updatedEvent = await Event.findByIdAndUpdate(
            { _id: new ObjectId(id) },
            {
              $set: updatedEventData,
            },
            { new: true }
          );
    
          if (!updatedEvent) {
            return res.status(400).json({ message: "event could not be updated" });
          }
          await deleteFiles(imageIds);
          return res.status(200).json({
            payload: updatedEvent,
          });
     
          // console.log(images);
         
        } else {
          const updatedEvent = await Event.findByIdAndUpdate(
            { _id: new ObjectId(id) },
            {
              $set: updatedEventData,
            },
            { new: true }
          );
    
          if (!updatedEvent) {
            return res.status(400).json({ message: "event could not be found" });
          }
          res.status(200).json({
            payload: updatedEvent,
          });
        }
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// SOFT DELETE EVENT
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid event ID" });
        
    const deleted = await Event.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true, updatedAt: new Date(), updatedBy: req.user?.id },
      { new: true }
    );
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    res.status(200).json({ success: true, message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getHiddenEvents = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const filter = {  };
    const events = await Event.find(filter)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    const total = await Event.countDocuments(filter);
    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
      events,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// TOGGLE isHidden ATTRIBUTE
export const toggleEventIsHidden = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid event ID" });

    const event = await Event.findById(id);
    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });

    event.isHidden = !event.isHidden;
    event.updatedAt = new Date();
    event.updatedBy = req.user?.id;
    await event.save();

    res.status(200).json({
      success: true,
      message: `Event isHidden set to ${event.isHidden}`,
      payload: event,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ...existing code...
