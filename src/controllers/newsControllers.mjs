import { News } from "../models/News.mjs";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { fileExists } from "../utils/isFileExist.mjs";
import { deleteFiles } from "../services/deleteFileService.mjs";
import { findUserByIdentifier } from "../services/getUser.mjs";
import mongoose from "mongoose";
import { changeMetadata } from "../services/changeFileMetaData.mjs";
import { ObjectId } from "mongodb";
import { removeMatchIds } from "../services/removeMatchIds.mjs";
import { verifyAdminOrCDA } from "../middlewares/verifyForAdminOrCDA.mjs";
import axios from "axios";
// import  url  from "inspector";
// import { body } from "express-validator";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
export const newsPostController = async (req, res, next) => {
  if(!req.user.role == 'cda') return res.status(403).json({message: 'forbidden'})
  try {

    let newsData = (({
      title,
      content,
      description,
      detail,
      author,
      isHidden,
      socialMediaPosted,
      strong,
    }) => ({
      title,
      content,
      description,
      detail,
      author,
      isHidden,
      socialMediaPosted,
      strong,
    }))(req.body);

      const imageFilePath = path.join("imagefile.json")
        let images
                console.log(imageFilePath)
              if( await fileExists(imageFilePath)){
                const imageData = await fs.readFile('imagefile.json', 'utf8')
                images = JSON.parse(imageData);
                await fs.unlink(imageFilePath);
              }
              else{
                images = []
              }
    const postedBy = req.user.id || "";
    newsData = {
      ...newsData,
      images: images,
      postedBy,
    };
    try {
  const news = await News.create(newsData);
      if(!news) return res.status(400).json({message: 'news could not be posted'})
        axios.post(
        'http://localhost:4040/new-content-to-post',
        {
          title: 'news',
          content: news
        }
      );
      // axios.post(
      //  { url:'http://localhost/4040/new-content-to-post',
      //   body: {
      //     title: 'news',
      //     content: 'some content relevant for the bot serve to process data'
      //   }
      
   // })
  return res.status(201).json({ payload: news });
} catch (error) {
  const imageIds = images.map((image) => image.id);
  await deleteFiles(imageIds);

  console.error("Failed to create news:", error.message);
  return res.status(400).json({
    message: "News could not be uploaded",
    error: error.message,
  });
}
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "news could not be upload, enternal server error" });
  }
};

// filter search
export const filterNews = async (req, res) => {
  try {
    const { title, author, fromDate, toDate, page = 1, limit = 10, description } = req.query;
    let filter = {};

    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }
        if (description) {
      filter.description = { $regex: author, $options: "i" };
    }
    if (author) {
      filter.author = { $regex: author, $options: "i" };
    }

    if (fromDate || toDate) {
      filter.createdAt = {};
      if (fromDate) {
        filter.createdAt.$gte = new Date(fromDate);
      }
      if (toDate) {
        filter.createdAt.$lte = new Date(toDate);
      }
    }
    const skip = (page - 1) * limit;
    const news = await News.find({
      ...filter,
      isHidden: { $ne: true },
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalNews = await News.countDocuments({
      ...filter,
      isHidden: { $ne: true },
    });
    const length = news.length;
    res.status(200).json({
      totalNews,
      page,
      length,
      news,
    });
  } catch (error) {
    console.error("Filter News Error:", error);
    res.status(500).json({ error: "Failed to filter news" });
  }
};

export const filterNewsAdmin = async (req, res) => {
   if(!req.user.role == 'cda') return res.status(403).json({message: 'forbidden'})
  try {
    const {
      title,
      author,
      fromDate,
      toDate,
      postedBy,
      isHidden,
      socialMediaPosted,
      editedBy,
      description,
      page = 1,
      limit = 10,
      adminLoked,
      cdaLoked,
    } = req.query;
    const filter = {};
    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }
    if (adminLoked) filter.adminLoked = adminLoked;
    if (cdaLoked) filter.cdaLoked = cdaLoked;
    if (author) {
      filter.author = { $regex: author, $options: "i" };
    }
    if (description) {
      filter.description = { $regex: author, $options: "i" };
    }

    if (fromDate || toDate) {
      filter.createdAt = {};
      if (fromDate) {
        filter.createdAt.$gte = new Date(fromDate);
      }
      if (toDate) {
        filter.createdAt.$lte = new Date(toDate);
      }
    }
    if (postedBy) {
      const user = await findUserByIdentifier(postedBy);
      if (!user)
        return res.status(404).json({
          message: `No system user with the username : ${postedBy}`,
        });
      filter.postedBy = user._id;
    }
    if (editedBy) {
      const user = await findUserByIdentifier(editedBy);
      if (!user)
        return res.status(404).json({
          message: `No system user with the username : ${editedBy}`,
        });
      filter.editedBy = user._id;
    }
    if (postedBy && mongoose.Types.ObjectId.isValid(filter.postedBy)) {
      filter.postedBy = new mongoose.Types.ObjectId(filter.postedBy);
    }
    if (editedBy && mongoose.Types.ObjectId.isValid(filter.editedBy)) {
      filter.postedBy = new mongoose.Types.ObjectId(filter.editedBy);
    }
    if (isHidden !== undefined) {
      filter.isHidden = isHidden === "true";
    }
    if (socialMediaPosted !== undefined) {
      filter.socialMediaPosted = socialMediaPosted === "true";
    }
    const skip = (page - 1) * limit;
    const news = await News.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    if (news.length == 0)
      return res.status(404).json({
        message: `no news to found woth filter ${JSON.stringify(filter)}`,
      });
    const totalNews = await News.countDocuments({filter});
    const length = news.length;
    res.status(200).json({
      totalNews,
      page,
      length,
      news,
    });
  } catch (error) {
    console.error("Filter News Error:", error);
    res.status(500).json({ error: "Failed to filter news" });
  }
};

// GET news by ID for naive users
export const getNewsById = async (req, res) => {
  try {
    const role = req.user?.role || 'naiveUser'
    const { _id } = req.params;
    const news = await News.findOne({ _id: _id, isHidden: false });
    if (!news) return res.status(404).json({ error: "News not found" });
    if(role == 'admin' || role == 'cda') return res.status(200).json({payload: news})
    const payload = (({
      title,
      content,
      description,
      detail,
      images,
      author,
    }) => ({ title, content, description, detail, images, author }))(news);
    res.status(200).json(payload);
  } catch (err) {
    console.error("Get News By ID Error:", err);
    res.status(500).json({ error: "Failed to fetch news" });
  }
};

// for admins
export const getNewsByIdAdmin = async (req, res) => {
  verifyAdminOrCDA(req, res, next)
  try {
    const { id } = req.params;
    const news = await News.findOne({ _id: id });
    if (!news) return res.status(404).json({ error: "News not found" });
    res.status(200).json(news);
  } catch (err) {
    console.error("Get News By ID Error:", err);
    res.status(500).json({ error: "Failed to fetch news" });
  }
};

// UPDATE news
export const updateNews = async (req, res) => {

  if(req.user?.role !== 'admin' && req.user?.role !== 'cda') return res.status(401).json({message: 'Unauthorized'})
  if (!req.body)
    return res.status(400).json({ message: "update data are required" });
  try {
    const { _id } = req.params;
    const {
      title,
      content,
      description,
      detail,
      author,
      isHidden,
      socialMediaPosted,
      strong,
      adminLoked,
      cdaLoked,
    } = req.body;
    let updatedData = {
      title,
      content,
      description,
      detail,
      author,
      isHidden,
      socialMediaPosted,
      strong,
      adminLoked,
      cdaLoked,
    };

    updatedData.editedAt = new Date();
    updatedData.editedBy = req.user.id || "";
    const { imageNames, imageChanged, formerImages, imageIds } = req.body;
    console.log(updatedData);
    if (imageChanged) {
      const imageFilePath = path.join("imagefile.json")
        let images
        console.log(images)
      if( await fileExists(imageFilePath)){
            const imageData = await fs.readFile("imagefile.json", "utf-8");
        images = JSON.parse(imageData);
        await fs.unlink(imageFilePath);
      }
      else{
        console.log(imageFilePath, 'no image')
        images = []
      }
           const newImage = await removeMatchIds(imageIds, formerImages, images);
       console.log(newImage)
      updatedData = {
        ...updatedData,
        images: newImage,
      };

      const updatedNews = await News.findByIdAndUpdate(
        { _id: new ObjectId(_id) },
        {
          $set: updatedData,
        },
        { new: true }
      );

      if (!updatedNews) {
        return res.status(400).json({ message: "news could not be updated" });
      }
      await deleteFiles(imageIds);
      return res.status(200).json({
        payload: updatedNews,
      });
 
      // console.log(images);
     
    } else if (imageNames) {
      const changes = await changeMetadata(imageNames);
      console.log(changes)
      if (changes.acknowledged == true) {
        for (let i = 0; i < imageNames.length; i++) {
          for (let j = 0; j < formerImages.length; j++) {
            if (imageNames[i].id == formerImages[j].id) {
              formerImages[j].name = imageNames[i].name
            }
          }
        }
        console.log(formerImages, 'former image')
          updatedData.images = formerImages
        const updatedNews = await News.findByIdAndUpdate(
          { _id: new ObjectId(_id) },
          {
            $set: updatedData,
          },
          { new: true }
        );
        if (!updatedNews)
          return res
            .status(400)
            .json({ message: "news could not be updated!" });
        res.status(200).json({ payload: updatedNews });
      }
    } else {
      const updatedNews = await News.findByIdAndUpdate(
        { _id: new ObjectId(_id) },
        {
          $set: updatedData,
        },
        { new: true }
      );

      if (!updatedNews) {
        return res.status(400).json({ message: "news could not be updated" });
      }
      res.status(200).json({
        payload: updatedNews,
      });
    }
  } catch (err) {
    console.error("Update News Error:", err);
    res.status(500).json({ error: "Failed to update news" });
  }
};

// SOFT DELETE news (set isHidden: true)
export const deleteNews = async (req, res) => {
  if(req.user.role !== 'admin' && req.user.role !== 'cda') return res.sendStatus(401)
  try {
    const  _id  = req.params?._id || req.params?.id
    const news = await News.findOne({_id: new ObjectId(_id)})
    if(!news) return res.status(404).json({message: `no news to be deleted with id ${_id}`})
      const images = news.images

    let imagesId = []
    
    images.map((image) => {
      imagesId.push(image.id)
    })
      const returnVal = await deleteFiles(imagesId)
      if(!returnVal) return res.status(400).json({message: 'news cant be deleted'})

        const deleted = await News.findOneAndDelete({_id: new ObjectId(_id)})
        if(!deleted) return res.status(400).json({message: 'news could not be deleted'})
          res.sendStatus(200);
  } catch (err) {
    console.error("Delete News Error:", err);
    res.status(500).json({ error: "Failed to delete news" });
  }
};
export const hideNews = async (req, res) => {
  if(req.user?.role !== 'cda' && req.user?.role !== 'admin') return res.status(403).json({message: 'forbidden'})
  try {
    const { _id } = req.params;
    const news = await News.findOne({_id: new ObjectId(_id)})
    if(!news) return res.status(404).json({message: `no news to be hidden with id ${_id}`})
      const hiddenNews = await News.findOneAndUpdate({isHidden: true})
    if(!hiddenNews) return res.status(400).json({message: `no news to be hidden with id ${_id}`})
  } catch (err) {
    console.error("Delete News Error:", err);
    res.status(500).json({ error: "Failed to delete news" });
  }
};
