import { News } from "../models/News.mjs";
import fs from "fs/promises";
import { deleteFiles } from "../services/deleteFileService.mjs";
import { findUserByIdentifier } from "../services/getUser.mjs";
import mongoose from "mongoose";
import { changeMetadata } from "../services/changeFileMetaData.mjs";
import { ObjectId } from "mongodb";
import { removeMatchIds } from "../services/removeMatchIds.mjs";

export const newsPostController = async (req, res) => {
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

    const imageData = await fs.readFile("imagefile.json", "utf-8");
    const images = await JSON.parse(imageData);
    console.log(images);
    const postedBy = req.user.id || "";
    newsData = {
      ...newsData,
      images: images,
      postedBy,
    };
    const news = await News.create(newsData);
    if (!news) {
      // once the news could not be updated delete the images that uploads before
      let imageIds = [];
      images.map((image) => {
        imageIds.push(image.id);
      });
      await deleteFiles(imageIds);
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

// filter search
export const filterNews = async (req, res) => {
  try {
    const { title, author, fromDate, toDate, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (title) {
      filter.title = { $regex: title, $options: "i" };
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
      return res
        .status(404)
        .json({
          message: `no news to found woth filter ${JSON.stringify(filter)}`,
        });
    const totalNews = await News.countDocuments({});
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
    const { _id } = req.params;
    const news = await News.findOne({ _id: _id, isHidden: false });
    if (!news) return res.status(404).json({ error: "News not found" });

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
  if(!req.body) return res.status(400).json({message: 'update data are required'})
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
    } 
    
    updatedData.editedAt = new Date();
    updatedData.editedBy = req.user.id || "";
    const { imageNames, imageChanged, formerImages, imageIds } = req.body;
    console.log(updatedData, )
    /**
     * if image name/s are sent that means the image metadata is changing
     * if image changed is true that means the former images are deleted and the new ones are stored so the new image ids are has to be fetched from the imagefile.json
     *
     * check for imageNames
     *    true update the new image names easy
     *    .then update the news content if there is any change
     * false check for image changed
     *      true delete the former image
     *      .then update the news content including the images object in it
     */
    if (imageChanged) {
      // formerImages.map((image) => {
      //   imageIds.push(image.id);
      // });
      
      const imageData = await fs.readFile("imagefile.json", "utf-8");
      const images = await JSON.parse(imageData);
      console.log(images);
      const newImage = await removeMatchIds(imageIds, formerImages, images)
      console.log(newImage)
      updatedData = {
        ...updatedData,
         newImage,
      }
      // THE NEWS image object should not be detached by overide with the new image meta data and uri

      //check iteratively for a match for deleted image with the existed one 
      // retain the ones don't match by id


      const updatedNews = await News.findByIdAndUpdate(
        {_id: new ObjectId(_id)}, 
        {
          $set: updatedData
        }, { new: true })

        if(!updatedNews) {
          return res.status(400).json({message: 'news could not be updated'})
        }
        await deleteFiles(formerImages);
        return res.status(200).json({
          payload: updatedNews
        })
    } 
    else if (imageNames) {
      const changes = await changeMetadata(imageNames);
      if(changes.acknowledged == true){
        const updatedNews = await News.findByIdAndUpdate(
          { _id: new ObjectId(_id) },
          {
            $set: updatedData
          },
          { new: true }
        );
        if(!updatedNews) return res.status(400).json({message: 'news could not be updated!'})
          res.status(200).json({payload: updatedNews})
      }
    } else {
          const updatedNews = await News.findByIdAndUpdate(
        {_id: new ObjectId(_id)}, 
        {
          $set: updatedData
        }, { new: true })

        if(!updatedNews) {
          return res.status(400).json({message: 'news could not be updated'})
        }
        res.status(200).json({
          payload: updatedNews
        })
    }
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
