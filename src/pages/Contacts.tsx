import React, { useState } from "react";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchContacts, deleteContact } from "../contactsApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

  const { data: contacts = [] } = useQuery({
    queryKey: ["contacts"],
    queryFn: fetchContacts,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.success("Contact deleted");
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
      if (a.name < b.name) return sortAscending ? -1 : 1;
      if (a.name > b.name) return sortAscending ? 1 : -1;
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
          onClick={toggleSortOrder}
          sx={{
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#cfcfcf",
            },
          }}
        >
          Sort by name
          {sortAscending ? (
            <ArrowUpwardIcon style={{ fontSize: 15 }} />
          ) : (
            <ArrowDownwardIcon style={{ fontSize: 15 }} />
          )}
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
                  <DeleteOutlineOutlinedIcon style={{ color: "#d30a0a" }} />
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
