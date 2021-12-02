const express = require("express");
const router = express.Router();
const Joi = require("joi");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../model");

const joinContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.json({ contacts, status: 200 });
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    if (!contact) {
      return res.status(404).json({
        message: "Not found",
        status: 404,
      });
    }
    res.json({
      contact,
      status: 200,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = joinContactSchema.validate(req.body);
    console.log(error);
    if (error) {
      return res.status(400).json({
        message: "missing required name field",
        status: 400,
      });
    }
    const newContact = await addContact(req.body);
    console.log(newContact);
    res.status(201).json({
      newContact,
      status: 201,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const removedContact = await removeContact(contactId);

    if (!removedContact) {
      return res.status(404).json({
        message: "Not found",
        status: 404,
      });
    }
    res.json({
      message: "contact deleted",
      status: 200,
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { error } = joinContactSchema.validate(req.body);
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "missing fields",
        status: 400,
      });
    }
    if (error) {
      const err = new Error(error.message);
      err.status = 400;
      throw err;
    }
    const { contactId } = req.params;
    const changedContact = await updateContact(contactId, req.body);
    if (!changedContact) {
      return res.status(404).json({
        message: "Not found",
        status: 404,
      });
    }
    res.json({
      changedContact,
      status: 200,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
