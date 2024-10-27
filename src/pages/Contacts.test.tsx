import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Contacts from "./Contacts";
import * as contactsApi from "../contactsApi";
import { fetchContacts } from "../contactsApi";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

jest.mock("../contactsApi");

const mockFetchContacts = fetchContacts as jest.MockedFunction<
  typeof fetchContacts
>;

const mockDeleteContact = contactsApi.deleteContact as jest.Mock;

const queryClient = new QueryClient();

const renderComponent = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <Contacts />
      <ToastContainer />
    </QueryClientProvider>
  );
};

describe("Contacts Component", () => {
  beforeEach(() => {
    mockFetchContacts.mockResolvedValue([
      { id: 1, name: "John Doe", position: "Frontend" },
      { id: 2, name: "Jane Smith", position: "Backend" },
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the component", async () => {
    renderComponent();
    expect(screen.getByText("Contact List")).toBeInTheDocument();
    expect(await screen.findByText("John Doe")).toBeInTheDocument();
    expect(await screen.findByText("Jane Smith")).toBeInTheDocument();
  });

  test("filters contacts by name", async () => {
    renderComponent();
    expect(await screen.findByText("John Doe")).toBeInTheDocument();
    expect(await screen.findByText("Jane Smith")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Filter by name"), {
      target: { value: "John" },
    });

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
  });

  test("sorts contacts by name", async () => {
    renderComponent();
    expect(await screen.findByText("John Doe")).toBeInTheDocument();
    expect(await screen.findByText("Jane Smith")).toBeInTheDocument();

    let contacts = screen.getAllByRole("listitem");
    let contactNames = contacts.map((contact) => contact?.textContent ?? "");
    contactNames[0]?.includes("John Doe") &&
      contactNames[1]?.includes("Jane Smith");

    fireEvent.click(screen.getByText("Sort by name"));
    contacts = screen.getAllByRole("listitem");
    contactNames = contacts.map((contact) => contact?.textContent ?? "");
    contactNames[1]?.includes("Jane Smith") &&
      contactNames[0]?.includes("John Doe");

    fireEvent.click(screen.getByText("Sort by name"));
    contacts = screen.getAllByRole("listitem");
    contactNames = contacts.map((contact) => contact?.textContent ?? "");
    contactNames[0]?.includes("John Doe") &&
      contactNames[1]?.includes("Jane Smith");
  });

  test("deletes a contact", async () => {
    const toastSpy = jest.spyOn(toast, "success").mockImplementation();
    mockDeleteContact.mockResolvedValue(1);
    renderComponent();
    expect(await screen.findByText("John Doe")).toBeInTheDocument();
    expect(await screen.findByText("Jane Smith")).toBeInTheDocument();

    const button = screen.getByTestId("delete-button-1");

    fireEvent.click(button);

    await waitFor(() => expect(mockDeleteContact).toHaveBeenCalledWith(1));

    expect(toastSpy).toHaveBeenCalledWith("Contact deleted");

    toastSpy.mockRestore();
  });

  test("shows error message when deleting a contact fails", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const toastSpy = jest.spyOn(toast, "error").mockImplementation();

    mockDeleteContact.mockRejectedValueOnce(
      new Error("Failed to delete contact")
    );
    renderComponent();
    expect(await screen.findByText("John Doe")).toBeInTheDocument();
    expect(await screen.findByText("Jane Smith")).toBeInTheDocument();

    const button = screen.getByTestId("delete-button-1");

    fireEvent.click(button);

    await waitFor(() => expect(mockDeleteContact).toHaveBeenCalledWith(1));

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error deleting contact:",
      expect.any(Error)
    );
    expect(toastSpy).toHaveBeenCalledWith("Failed to delete contact");
  });
});
