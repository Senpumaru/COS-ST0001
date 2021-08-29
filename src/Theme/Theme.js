import { ruRU } from "@material-ui/core/locale";
import { createTheme, ThemeProvider, styled } from "@material-ui/core/styles";

const theme = createTheme(
  {
    mixins: {
      toolbar: {
        minHeight: 42,
      },
    },
    palette: {
      common: {},
      primary: {
        light: "#918e84",
        main: "#575550",
        dark: "#33322f",
      },
      secondary: {
        light: "#ffefba",
        main: "#edbc1c",
        dark: "#735a07",
      },
    },
    typography: {
      htmlFontSize: 16,
      fontSize: 14,
      fontFamily: ["Montserrat", "sans-serif"].join(","),

      h2: {},
      h3: {},
      h5: {},

      button: {
        minWidth: 2,
      },
    },
    shape: {
      borderRadius: 0,
    },

    overrides: {
      MuiTableCell: {
        root: {
          paddingTop: 2,
          paddingBottom: 2,
          "&:last-child": {
            paddingRight: 2,
          },
        },
      },
    },
  },
  ruRU
);

export default theme;
