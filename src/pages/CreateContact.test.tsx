import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateContact from "./CreateContact";
import Contacts from "./Contacts";
import * as contactsApi from "../contactsApi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";

jest.mock("../contactsApi");

const mockAddContact = contactsApi.addContact as jest.Mock;
const mockFetchContacts = contactsApi.fetchContacts as jest.Mock;

const queryClient = new QueryClient();

const renderComponent = (component: React.ReactNode) => {
  render(
    <QueryClientProvider client={queryClient}>
      {component}
      <ToastContainer />
    </QueryClientProvider>
  );
};

describe("CreateContact Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the component", () => {
    renderComponent(<CreateContact />);
    expect(screen.getByText("Create new contact")).toBeInTheDocument();
  });

  test("shows validation errors when fields are empty", async () => {
    renderComponent(<CreateContact />);

    fireEvent.click(screen.getByText("Create Contact"));

    expect(await screen.findByText("Name is required")).toBeInTheDocument();
    expect(await screen.findByText("Position is required")).toBeInTheDocument();
  });

  test("creates a contact successfully and verifies it on the contacts page", async () => {
    mockAddContact.mockResolvedValueOnce({
      id: "1",
      name: "John Doe",
      position: "Frontend",
    });
    mockFetchContacts.mockResolvedValueOnce([
      { id: "1", name: "John Doe", position: "Frontend" },
    ]);

    renderComponent(<CreateContact />);

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.mouseDown(screen.getByLabelText("Position"));
    fireEvent.click(screen.getByText("Frontend"));

    fireEvent.click(screen.getByText("Create Contact"));

    await waitFor(() =>
      expect(mockAddContact).toHaveBeenCalledWith({
        name: "John Doe",
        position: "Frontend",
      })
    );

    renderComponent(<Contacts />);
    expect(await screen.findByText("John Doe")).toBeInTheDocument();
  });

  test("clears name error when field is filled and blurred", async () => {
    renderComponent(<CreateContact />);

    fireEvent.click(screen.getByText("Create Contact"));
    expect(await screen.findByText("Name is required")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.blur(screen.getByLabelText("Name"));

    await waitFor(() =>
      expect(screen.queryByText("Name is required")).not.toBeInTheDocument()
    );
  });
});
