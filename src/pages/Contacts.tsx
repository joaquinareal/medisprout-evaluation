import React, { useState } from "react";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchContacts, deleteContact } from "../contactsApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Contact } from "../types";
import {
  TextField,
  List,
  ListItem,
  ListItemText,
  Paper,
  Button,
  Box,
  Typography,
  IconButton,
} from "@mui/material";

const Contacts: React.FC = () => {
  const [filter, setFilter] = useState("");
  const [sortAscending, setSortAscending] = useState(true);
  const queryClient = useQueryClient();

  const { data: contacts = [] } = useQuery<Contact[]>({
    queryKey: ["contacts"],
    queryFn: fetchContacts,
    refetchOnWindowFocus: true,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.success("Contact deleted");
    },
    onError: (error) => {
      console.error("Error deleting contact:", error);
      toast.error("Failed to delete contact");
    },
  });

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  const toggleSortOrder = () => {
    setSortAscending(!sortAscending);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const filteredContacts = contacts
    .filter((contact) =>
      contact.name.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      if (sortAscending) {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
      }
      return 0;
    });

  return (
    <Box>
      <Box marginBottom="20px">
        <Typography fontSize="30px" fontFamily="sans-serif" variant="h1">
          Contact List
        </Typography>
      </Box>
      <Paper style={{ padding: "16px" }} elevation={6}>
        <TextField
          label="Filter by name"
          variant="outlined"
          fullWidth
          value={filter}
          onChange={handleFilterChange}
          margin="normal"
          sx={{
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: "#00AAE4",
              },
            },
          }}
        />
        <Button
          variant="text"
          size="small"
          onClick={toggleSortOrder}
          sx={{
            textTransform: "none",
            backgroundColor: sortAscending ? "#ddf4f5" : "none",
            "&:hover": {
              backgroundColor: "#ddf4f5",
            },
          }}
        >
          Sort by name
        </Button>
        <List>
          {filteredContacts.map((contact) => (
            <ListItem
              key={contact.id}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(contact.id)}
                >
                  <DeleteOutlineOutlinedIcon
                    style={{ color: "#d30a0a" }}
                    data-testid={`delete-button-${contact.id}`}
                  />
                </IconButton>
              }
            >
              <ListItemText
                primary={contact.name}
                secondary={contact.position}
              />
            </ListItem>
          ))}
        </List>
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

export default Contacts;
