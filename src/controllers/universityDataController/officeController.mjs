import { Office } from "../../models/universityData/offices.mjs";
import { ObjectId } from "mongodb";

export const createOffice = async (req, res) => {
  try {
    if (req.user?.role !== "admin" && req.user?.role !== "cda")
      return res.status(401).json({ message: "un authorize" });
    const { name, location, president, msg, phone, email, pobox, isHidden } =
      req.body;

    const office = {
      name,
      location,
      president,
      msg,
      phone,
      email,
      pobox,
      isHidden,
    };
    const isOfficeNumberReserved = await Office.exists({ phone, email });
    if (isOfficeNumberReserved)
      return res
        .status(403)
        .json({
          message:
            "the phone number and or email is reserved to another office, change another one",
        });
    const newOffice = await Office.create(office);
    if (!newOffice)
      return res.status(400).json({ message: "office could not created" });
    res.status(201).json({ message: "office created", data: newOffice });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllOffices = async (req, res) => {
  try {
    const offices = await Office.find({ isHidden: { $ne: true } });
    if (!offices)
      return res.status(404).json({ message: "no offices could be found" });
    return res.status(200).json({ payload: offices });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOfficeById = async (req, res) => {
  try {
    const { id } = req.params;
    const office = await Office.findById({ _id: new ObjectId(id) });
    if (!office)
      return res
        .status(404)
        .json({ message: `no office could be found with id: ${id}` });
    return res.status(200).json({ payload: office });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOffice = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, president, msg, phone, email, pobox, isHidden } =
      req.body;
    let updatedOfficeData = {};
    name ? (updatedOfficeData.name = name) : "";
    updatedOfficeData.updatedAt = new Date();
    president ? (updatedOfficeData.president = location) : "";
    msg ? (updatedOfficeData.msg = msg) : "";
    phone ? (updatedOfficeData.phone = phone) : "";
    email ? (updatedOfficeData.email = email) : "";
    pobox ? (updatedOfficeData.pobox = pobox) : "";
    isHidden ? (updatedOfficeData.location = isHidden) : "";

    const existingOffice = await Office.findOne({
  _id: { $ne: new ObjectId(id) }, 
  $or: [{ phone }, { email }],
});
    if (existingOffice)
      return res
        .status(403)
        .json({
          message:
            "the phone number and or email is reserved to another office, change another one",
        });
    const updatedOffice = await Office.findByIdAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updatedOfficeData },
      { new: true }
    );
    if (!updatedOffice)
      return res.status(400).json({ message: "office could not be updated" });
    return res.status(200).json(updatedOffice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteOffice = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "cda")
      return res.sendStatus(401);
    try {
      const { id } = req.params;
      const office = await Office.findOne({ _id: new ObjectId(id) });
      if (!office)
        return res
          .status(404)
          .json({ message: `no office to be deleted with id ${id}` });
      
      const deleted = await Office.findOneAndDelete({
        _id: new ObjectId(id),
      });
      if (!deleted)
        return res
          .status(400)
          .json({ message: "office could not be deleted" });
      res.sendStatus(200);
    } catch (err) {
      console.error("Delete campus Error:", err);
      res.status(500).json({ error: "Failed to delete office" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
