import { createTheme } from "@mui/material";
import { default as ColorPalette } from "./Colors";


const Theme = createTheme({
  palette: ColorPalette,
  typography: {
    fontFamily: "sans-serif",
  },
});

export default Theme;
