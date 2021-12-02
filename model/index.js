const fs = require("fs/promises");
const path = require("path");
const shortId = require("uuid");
const contacts = require("./contacts.json");
const contactsPath = path.join(__dirname, "./contacts.json");

const listContacts = async () => {
  return (data = JSON.parse(await fs.readFile(contactsPath, "utf-8")));
};

const getContactById = async (contactId) => {
  const oneContact = contacts.find(
    (contact) => String(contact.id) === String(contactId)
  );
  if (!oneContact) return null;
  return oneContact;
};

const removeContact = async (contactId) => {
  const idContact = contacts.findIndex(
    (item) => String(item.id) === String(contactId)
  );
  if (idContact === -1) null;
  const rmContact = contacts[idContact];
  contacts.splice(idContact, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts));
  return rmContact;
};

const addContact = async ({ name, email, phone }) => {
  const id = shortId.v4();
  const arg = { id, name, email, phone };
  const add = contacts.push(arg);
  await fs.writeFile(contactsPath, JSON.stringify(contacts));
  return arg;
};

const updateContact = async ({ contactId, body }) => {
  const idContact = contacts.findIndex(
    (item) => String(item.id) === String(contactId)
  );
  if (idContact === -1) null;
  contacts[idContact] = { ...body, id: contactId };
  await fs.writeFile(contactsPath, JSON.stringify(contacts));
  return contacts[idContact];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
