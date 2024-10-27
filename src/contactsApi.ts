import { Contact } from "./types";
const API_URL = "http://localhost:5001/contacts";

export const fetchContacts = async (): Promise<Contact[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch contacts");
  }
  return response.json();
};

export const addContact = async (
  contact: Omit<Contact, "id">
): Promise<Contact> => {
  try {
    const contacts = await fetchContacts();
    const highestId = contacts.reduce(
      (maxId, contact) => Math.max(contact.id, maxId),
      0
    );
    const newId = highestId + 1;

    const newContact = { ...contact, id: newId.toString() };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newContact),
    });

    return response.json();
  } catch (error) {
    throw new Error("Failed to add contact");
  }
};

export const deleteContact = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete contact");
  }
};
