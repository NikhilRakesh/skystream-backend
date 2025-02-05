import { stat } from "fs";
import Message from "../models/contactModel.js";
import User from "../models/userModel.js";

export const addMessage = async (req, res) => {
  try {
    const { message, to, block, subject } = req.body;

    const { id } = req.params;

    if (!message || !to) {
      return res.status(401).json({ message: "Please provide all fields" });
    }

    if (!id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const user = await User.findById({ _id: to });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    let newMessage = {
      block: block,
      data: message,
      subject: subject,
    };

    const Updated = await User.findByIdAndUpdate(
      { _id: to },
      { $set: { message: newMessage } },
      { new: true }
    );

    return res.status(201).json({ date: Updated, message: "Message sent" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { ids, sendId } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No valid message IDs provided" });
    }

    const result = await Message.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "No messages found for deletion" });
    }

    return res.status(200).json({
      success: true,
      message: `${result.deletedCount} message(s) deleted successfully`,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const contactUs = async (req, res) => {
  try {
    const { name, email, contact, message } = req.body;

    if (!name || !email || !contact || !message) {
      return res.status(401).json({ message: "Please provide all fields" });
    }

    const newMessage = new Message({
      name,
      email,
      contact,
      message,
    });

    newMessage
      .save()
      .then((data) => {
        return res
          .status(201)
          .json({ message: "Message sent successfully", data: data });
      })
      .catch((err) => {
        return res.status(500).json({ error: err.message });
      });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteInbox = async (req, res) => {
  try {
    const { userId } = req.params;
    const { Ids } = req.body;
    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }
    const userData = await User.findById({ _id: userId });
    if (!userData.superAdmin) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (!Ids) {
      return res.status(401).json({ message: "No Messages Selected" });
    }

    Ids.map(async (index) => {
      await Message.findByIdAndDelete({ _id: index });
    });
    return res.status(201).json({ message: "Messages deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const data = await Message.find({}).sort({ createdAt: -1 });
    console.log(data.length);
    return res.status(201).json({ data: data });
  } catch (error) {}
};
