import React from "react";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";

const queryClient = new QueryClient();

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

describe("App Component", () => {
  test("renders Sidebar component", () => {
    renderWithProviders(<App />);
    expect(screen.getByText("Contacts")).toBeInTheDocument();
  });

  test("renders Contacts component on /contacts route", () => {
    window.history.pushState({}, "Contacts Page", "/contacts");
    renderWithProviders(<App />);
    expect(screen.getByText("Contact List")).toBeInTheDocument();
  });

  test("renders CreateContact component on /contacts/create route", () => {
    window.history.pushState({}, "Create Contact Page", "/contacts/create");
    renderWithProviders(<App />);
    expect(screen.getByText("Create new contact")).toBeInTheDocument();
  });
});
