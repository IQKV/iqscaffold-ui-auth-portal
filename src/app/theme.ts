import { createTheme, MantineColorsTuple } from "@mantine/core";

// Define custom colors - Purple gradient inspired by auth background
const primary: MantineColorsTuple = [
  "#f3f0ff",
  "#e5dbff",
  "#d0bfff",
  "#b197fc",
  "#9775fa",
  "#845ef7",
  "#7950f2",
  "#7048e8",
  "#6741d9",
  "#5f3dc4",
];

const secondary: MantineColorsTuple = [
  "#fce4ec",
  "#f8bbd9",
  "#f48fb1",
  "#f06292",
  "#ec407a",
  "#e91e63",
  "#d81b60",
  "#c2185b",
  "#ad1457",
  "#880e4f",
];

export const theme = createTheme({
  colors: {
    primary,
    secondary,
  },
  primaryColor: "primary",
  defaultRadius: "md",
  fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
  headings: {
    fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
  },
  white: "#f8f9fa",
  black: "#2d3748",
  other: {
    bodyLight: "#f1f3f5",
    bodyDark: "#2d3748",
  },
});
