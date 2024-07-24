import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useEffect } from "react";
import { Tune } from "@mui/icons-material";
import { Tooltip } from "@mui/material";

const options = [
  "None",
  "Atria",
  "Callisto",
  "Dione",
  "Ganymede",
  "Hangouts Call",
  "Luna",
  "Oberon",
  "Phobos",
  "Pyxis",
  "Sedna",
  "Titania",
  "Triton",
  "Umbriel",
];

const ITEM_HEIGHT = 48;

export default function OptionMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (curr, row) => {
    props.currentChange(curr, row);
    handleClose();
  };

  return (
    <div>
      <Tooltip title={"Actions"}>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <Tune />
      </IconButton>
      </Tooltip>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        // onChange={(e) => handleChange(e)}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: "20ch",
          },
        }}
      >
        {props.options.map((option) => {
          return (
          <MenuItem
            key={option.name}
            //   selected={option.name}
            onClick={() => handleChange(option.name, props.row)}
          >

            {
            option.name === "allow_update" ? `Update ${props.name}` : option.name === "allow_delete" ? `Delete ${props.name}` : ""
            }
            
          </MenuItem>
          )
        })}
      </Menu>
    </div>
  );
}
