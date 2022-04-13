import { createContext, useEffect, useReducer } from "react";

import axios from "../utils/request";
import { isValidToken, setSession } from "../utils/jwt";

const INITIALIZE = "INITIALIZE";
const SIGN_IN = "SIGN_IN";
const SIGN_OUT = "SIGN_OUT";
const initialState = {
  isAuthenticated: false, isInitialized: false, user: null
};

const JWTReducer = (state, action) => {
  switch (action.type) {
    case INITIALIZE:
      return {
        isAuthenticated: action.payload.isAuthenticated, isInitialized: true, user: action.payload.user
      };
    case SIGN_IN:
      return {
        ...state, isAuthenticated: true, user: action.payload.user
      };
    case SIGN_OUT:
      return {
        ...state, isAuthenticated: false, user: null
      };

    default:
      return state;
  }
};

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(JWTReducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem("accessToken");
        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);
          const response = await axios.get("/api/auth/my_account");
          const { code, message, data } = response;
          if (code === 1) {
            setSession(null);
            dispatch({ type: SIGN_OUT });
            return;
          }
          dispatch({
            type: INITIALIZE, payload: {
              isAuthenticated: true, user: data
            }
          });
        } else {
          dispatch({
            type: INITIALIZE, payload: {
              isAuthenticated: false, user: null
            }
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: INITIALIZE, payload: {
            isAuthenticated: false, user: null
          }
        });
      }
    };

    initialize();
  }, []);

  const signIn = async (username, password) => {
    const response = await axios.post("/api/auth/get_token", {
      username, password
    });
    const { code, message, data } = response;
    if (code === 1) {
      throw new Error(message);
    }
    setSession(data.access_token);
    dispatch({
      type: SIGN_IN, payload: {
        user: data.user
      }
    });
  };

  const signOut = async () => {
    setSession(null);
    dispatch({ type: SIGN_OUT });
  };

  return (<AuthContext.Provider
    value={{
      ...state, method: "jwt", signIn, signOut
    }}
  >
    {children}
  </AuthContext.Provider>);
}

export { AuthContext, AuthProvider };
