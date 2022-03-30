import merge from "deepmerge";
import { green, grey, indigo, red } from "@mui/material/colors";
import { THEMES } from "../constants";

const customBlue = {
  50: "#e9f0fb",
  100: "#c8daf4",
  200: "#a3c1ed",
  300: "#7ea8e5",
  400: "#6395e0",
  500: "#4782da",
  600: "#407ad6",
  700: "#376fd0",
  800: "#2f65cb",
  900: "#2052c2 ",
};

const defaultVariant = {
  name: THEMES.DEFAULT,
  palette: {
    mode: "light",
    primary: {
      main: customBlue[700],
      contrastText: "#FFF",
    },
    secondary: {
      main: customBlue[500],
      contrastText: "#FFF",
    },
    background: {
      default: "#F7F9FC",
      paper: "#FFF",
    },
  },
  header: {
    color: grey[500],
    background: "#FFF",
    search: {
      color: grey[800],
    },
    indicator: {
      background: customBlue[600],
    },
  },
  footer: {
    color: grey[500],
    background: "#FFF",
  },
  sidebar: {
    color: grey[200],
    background: "#233044",
    header: {
      color: grey[200],
      background: "#233044",
      brand: {
        color: customBlue[500],
      },
    },
    footer: {
      color: grey[200],
      background: "#1E2A38",
      online: {
        background: green[500],
      },
    },
    badge: {
      color: "#FFF",
      background: customBlue[500],
    },
  },
};

const darkVariant = merge(defaultVariant, {
  name: THEMES.DARK,
  palette: {
    mode: "dark",
    primary: {
      main: customBlue[600],
      contrastText: "#FFF",
    },
    background: {
      default: "#1B2635",
      paper: "#233044",
    },
    text: {
      primary: "rgba(255, 255, 255, 0.95)",
      secondary: "rgba(255, 255, 255, 0.5)",
    },
  },
  header: {
    color: grey[300],
    background: "#1B2635",
    search: {
      color: grey[200],
    },
  },
  footer: {
    color: grey[300],
    background: "#233044",
  },
});

const lightVariant = merge(defaultVariant, {
  name: THEMES.LIGHT,
  palette: {
    mode: "light",
  },
  header: {
    color: grey[200],
    background: customBlue[800],
    search: {
      color: grey[100],
    },
    indicator: {
      background: red[700],
    },
  },
  sidebar: {
    color: grey[900],
    background: "#FFF",
    header: {
      color: "#FFF",
      background: customBlue[800],
      brand: {
        color: "#FFFFFF",
      },
    },
    footer: {
      color: grey[800],
      background: "#F7F7F7",
      online: {
        background: green[500],
      },
    },
  },
});

const blueVariant = merge(defaultVariant, {
  name: THEMES.BLUE,
  palette: {
    mode: "light",
  },
  sidebar: {
    color: "#FFF",
    background: customBlue[700],
    header: {
      color: "#FFF",
      background: customBlue[800],
      brand: {
        color: "#FFFFFF",
      },
    },
    footer: {
      color: "#FFF",
      background: customBlue[800],
      online: {
        background: "#FFF",
      },
    },
    badge: {
      color: "#000",
      background: "#FFF",
    },
  },
});

const greenVariant = merge(defaultVariant, {
  name: THEMES.GREEN,
  palette: {
    primary: {
      main: green[800],
      contrastText: "#FFF",
    },
    secondary: {
      main: green[500],
      contrastText: "#FFF",
    },
  },
  header: {
    indicator: {
      background: green[600],
    },
  },
  sidebar: {
    color: "#FFF",
    background: green[700],
    header: {
      color: "#FFF",
      background: green[800],
      brand: {
        color: "#FFFFFF",
      },
    },
    footer: {
      color: "#FFF",
      background: green[800],
      online: {
        background: "#FFF",
      },
    },
    badge: {
      color: "#000",
      background: "#FFF",
    },
  },
});

const indigoVariant = merge(defaultVariant, {
  name: THEMES.INDIGO,
  palette: {
    primary: {
      main: indigo[600],
      contrastText: "#FFF",
    },
    secondary: {
      main: indigo[400],
      contrastText: "#FFF",
    },
  },
  header: {
    indicator: {
      background: indigo[600],
    },
  },
  sidebar: {
    color: "#FFF",
    background: indigo[700],
    header: {
      color: "#FFF",
      background: indigo[800],
      brand: {
        color: "#FFFFFF",
      },
    },
    footer: {
      color: "#FFF",
      background: indigo[800],
      online: {
        background: "#FFF",
      },
    },
    badge: {
      color: "#000",
      background: "#FFF",
    },
  },
});

const dimRatio = 0.7
const deepDarkVariant = merge(defaultVariant, {
  name: THEMES.DEEP_DARK,
  palette: {
    mode: "dark",
    background: {
      paper: "#202124",
      default: "rgb(23, 23, 23)",
    },
    primary: {
      main: "#bdc1c6",
      contrastText: "rgb(23, 23, 23)",
      light: `rgba(95, 139, 217, ${dimRatio})`
    },
    secondary: {
      main: "rgba(255, 255, 255, 0.7)",
      contrastText: "#FFF",
    },
    success: {
      main: "rgb(76, 175, 80)",
      light: `rgba(76, 175, 80, ${dimRatio})`
    },
    info: {
      main: "rgb(3, 169, 244)",
      light: `rgb(3, 169, 244, ${dimRatio})`
    },
    error: {
      main: "rgb(239, 83, 80)",
      light: `rgba(239, 83, 80, ${dimRatio})`
    }
  },
  header: {
    color: "#FFF",
    background: "rgb(23, 23, 23)",
    search: {
      color: grey[800],
    },
    indicator: {
      background: "rgba(0, 0, 0, 0.6)",
    },
  },
  footer: {
    color: "#FFF",
    background: "rgba(0, 0, 0, 0.87)",
  },
  sidebar: {
    color: grey[200],
    background: "#202124",
    header: {
      color: grey[200],
      background: "#202124",
      brand: {
        color: customBlue[500],
      },
    },
    footer: {
      color: grey[200],
      background: "#121212",
      online: {
        background: green[500],
      },
    },
    badge: {
      color: "#121212",
      background: customBlue[500],
    },
  },
});

const variants = [
  defaultVariant,
  darkVariant,
  lightVariant,
  blueVariant,
  greenVariant,
  indigoVariant,
  deepDarkVariant
];

export default variants;
