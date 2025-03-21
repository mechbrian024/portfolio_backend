import contactModel from "../models/contact.model.js";
import extend from "lodash/extend.js";
import errorHandler from "../helpers/dbErrorHandler.js";

const create = async (req, res) => {
  const contact = new contactModel(req.body);
  try {
    console.log("received request body in create: ", req.body);
    await contact.save();
    return res.status(200).json({
      message: "Successfully signed up!",
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const list = async (req, res) => {
  try {
    let contacts = await contactModel.find().select("firstname lastname email");
    res.json(contacts);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const contactByID = async (req, res, next, id) => {
  try {
    let contact = await contactModel.findById(id);

    if (!contact) {
      return res.status("400").json({
        error: "Contact not found",
      });
    }

    req.profile = contact;
    next();
  } catch (err) {
    return res.status("400").json({
      error: "Could not retrieve contact",
    });
  }
};

const read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

const update = async (req, res) => {
  try {
    let contact = req.profile;
    contact = extend(contact, req.body);
    contact.updated = Date.now();
    await contact.save();
    contact.hashed_password = undefined;
    contact.salt = undefined;
    res.json(contact);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const remove = async (req, res) => {
  try {
    let contact = req.profile;
    let deletedContact = await contact.deleteOne();
    deletedContact.hashed_password = undefined;
    deletedContact.salt = undefined;
    res.json(deletedContact);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const removeAll = async (req, res) => {
  let { ids } = req.body; // Assuming IDs are sent in the request body
  try {
    if (!Array.isArray(ids) || ids.length === 0) {
      const allContacts = await contactModel.find({}, "_id"); // Get all user IDs
      ids = allContacts.map((contact) => contact._id); // Extract only _id values
      // return res.status(400).json({
      //   error: "Please provide an array of IDs to delete.",
      // });
    }

    if (ids.length === 0) {
      return res.status(400).json({ error: "No users found to delete." });
    }

    const result = await contactModel.deleteMany({ _id: { $in: ids } });

    return res.status(200).json({
      message: `${result.deletedCount} users successfully deleted!`,
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

export default { create, contactByID, read, list, remove, update, removeAll };
