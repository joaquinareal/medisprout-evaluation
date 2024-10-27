import React, { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  Paper,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addContact } from "../contactsApi";
import { ToastContainer, toast } from "react-toastify";
import { Contact } from "../types";
import "react-toastify/dist/ReactToastify.css";

const CreateContact: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [position, setPosition] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [positionError, setPositionError] = useState<string>("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.success("Contact created");
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    let hasError = false;

    if (!name) {
      setNameError("Name is required");
      hasError = true;
    } else {
      setNameError("");
    }

    if (!position) {
      setPositionError("Position is required");
      hasError = true;
    } else {
      setPositionError("");
    }

    if (hasError) {
      return;
    }

    const newContact: Omit<Contact, "id"> = { name, position };
    mutation.mutate(newContact);
    setName("");
    setPosition("");
  };

  return (
    <Box>
      <Box marginBottom="20px">
        <Typography fontSize="30px" fontFamily="sans-serif" variant="h1">
          Create new contact
        </Typography>
      </Box>
      <Paper style={{ padding: "16px" }} elevation={6}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            maxWidth: "500px",
            margin: "50px auto",
          }}
        >
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => {
              if (name) setNameError("");
            }}
            error={!!nameError}
            helperText={nameError}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: nameError ? "red" : "none",
                },
                "&.Mui-focused fieldset": {
                  borderColor: nameError ? "red" : "#00AAE4",
                },
              },
            }}
          />
          <TextField
            select
            label="Position"
            data-testid="position-select"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            onBlur={() => {
              if (position) setPositionError("");
            }}
            error={!!positionError}
            helperText={positionError}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: positionError ? "red" : "none",
                },
                "&.Mui-focused fieldset": {
                  borderColor: positionError ? "red" : "#00AAE4",
                },
              },
            }}
          >
            <MenuItem value="Frontend">Frontend</MenuItem>
            <MenuItem value="Backend">Backend</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
          <Button
            variant="contained"
            type="submit"
            sx={{
              backgroundColor: "#00AAE4",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#0077b6",
              },
            }}
          >
            Create Contact
          </Button>
        </Box>
      </Paper>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        closeOnClick
        theme="colored"
      />
    </Box>
  );
};

export default CreateContact;
