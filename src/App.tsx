import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Contacts from "./pages/Contacts";
import CreateContact from "./pages/CreateContact";
import Sidebar from "./components/Sidebar";
import { Box, CssBaseline } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Box display="flex">
          <CssBaseline />
          <Sidebar />
          <Box
            component="main"
            flexGrow={1}
            p={3}
            marginX="200px"
            marginY="80px"
          >
            <Routes>
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/contacts/create" element={<CreateContact />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
