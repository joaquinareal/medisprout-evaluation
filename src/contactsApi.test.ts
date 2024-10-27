import { fetchContacts, addContact, deleteContact } from "./contactsApi";
import fetchMock from "jest-fetch-mock";

beforeEach(() => {
  fetchMock.resetMocks();
});

describe("contactsApi", () => {
  describe("fetchContacts", () => {
    it("fetches contacts successfully", async () => {
      const mockContacts = [
        { id: 1, name: "John Doe", position: "Frontend" },
        { id: 2, name: "Jane Smith", position: "Backend" },
      ];
      fetchMock.mockResponseOnce(JSON.stringify(mockContacts));

      const contacts = await fetchContacts();
      expect(contacts).toEqual(mockContacts);
      expect(fetchMock).toHaveBeenCalledWith("http://localhost:5001/contacts");
    });

    it("throws an error when fetching contacts fails", async () => {
      fetchMock.mockRejectOnce(new Error("Failed to fetch contacts"));

      await expect(fetchContacts()).rejects.toThrow("Failed to fetch contacts");
    });

    it("throws an error when the response is not ok", async () => {
      fetchMock.mockResponseOnce("", { status: 500 });

      await expect(fetchContacts()).rejects.toThrow("Failed to fetch contacts");
    });
  });

  describe("addContact", () => {
    it("adds a contact successfully", async () => {
      const newContact = { name: "John Doe", position: "Frontend" };
      const mockContacts = [{ id: 1, name: "Jane Smith", position: "Backend" }];
      const addedContact = { ...newContact, id: "2" };

      fetchMock.mockResponses(
        [JSON.stringify(mockContacts), { status: 200 }],
        [JSON.stringify(addedContact), { status: 201 }]
      );

      const contact = await addContact(newContact);
      expect(contact).toEqual(addedContact);

      const expectedBody = JSON.stringify({ ...newContact, id: "2" });
      const actualBody = fetchMock.mock.calls[1][1]?.body;

      expect(fetchMock).toHaveBeenCalledWith("http://localhost:5001/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: expectedBody,
      });

      expect(JSON.parse(actualBody as string)).toEqual(
        JSON.parse(expectedBody)
      );
    });

    it("throws an error when adding a contact fails", async () => {
      const newContact = { name: "John Doe", position: "Frontend" };
      fetchMock.mockRejectOnce(new Error("Failed to add contact"));

      await expect(addContact(newContact)).rejects.toThrow(
        "Failed to add contact"
      );
    });

    it("throws an error when the response is not ok", async () => {
      const newContact = { name: "John Doe", position: "Frontend" };
      fetchMock.mockResponseOnce("", { status: 500 });

      await expect(addContact(newContact)).rejects.toThrow(
        "Failed to add contact"
      );
    });
  });

  describe("deleteContact", () => {
    it("deletes a contact successfully", async () => {
      fetchMock.mockResponseOnce("", { status: 200 });

      await deleteContact(1);
      expect(fetchMock).toHaveBeenCalledWith(
        "http://localhost:5001/contacts/1",
        {
          method: "DELETE",
        }
      );
    });

    it("throws an error when deleting a contact fails", async () => {
      fetchMock.mockRejectOnce(new Error("Failed to delete contact"));

      await expect(deleteContact(1)).rejects.toThrow(
        "Failed to delete contact"
      );
    });

    it("throws an error when the response is not ok", async () => {
      fetchMock.mockResponseOnce("", { status: 500 });

      await expect(deleteContact(1)).rejects.toThrow(
        "Failed to delete contact"
      );
    });
  });
});
