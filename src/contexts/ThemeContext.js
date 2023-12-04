import React, { useEffect } from "react";

import { THEMES } from "../constants";

const initialState = {
  theme: THEMES.DEEP_DARK,
  setTheme: (theme) => { },
};
const ThemeContext = React.createContext(initialState);

function ThemeProvider({ children }) {
  const initialState = () => {
    const storedTheme = localStorage.getItem("theme");

    return storedTheme ? JSON.parse(storedTheme) : THEMES.DEEP_DARK;
  };

  const [theme, _setTheme] = React.useState(initialState());

  const setTheme = (theme) => {
    localStorage.setItem("theme", JSON.stringify(theme));
    _setTheme(theme);
  };

  useEffect(() => {
    // 触发事件 injectTheme
    window.dispatchEvent(new Event("injectTheme"));
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export { ThemeProvider, ThemeContext };
