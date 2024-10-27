import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { Link as RouterLink } from "react-router-dom";

const drawerWidth = 240;

export default function ResponsiveDrawer() {
  const drawer = (
    <Box padding="20px">
      <img
        src="https://mymedi.health/wp-content/uploads/2023/02/MyMediHealth-by-MediSprout-logo-1024x344.png"
        alt=""
        style={{ width: "200px", height: "auto" }}
      />
      <List>
        {[
          { text: "Contacts", icon: <PeopleOutlineIcon />, path: "/contacts" },
          {
            text: "Create Contact",
            icon: <PersonAddAltIcon />,
            path: "/contacts/create",
          },
        ].map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={RouterLink} to={item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
        bgcolor="red"
      >
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              bgcolor: "#e4e4e5",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}
