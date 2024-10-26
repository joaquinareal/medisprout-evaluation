import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Contacts from "./pages/Contacts";
import CreateContact from "./pages/CreateContact";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/contacts/create" element={<CreateContact />} />
      </Routes>
    </Router>
  );
};

export default App;
