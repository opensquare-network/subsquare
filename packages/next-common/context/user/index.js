import { createContext, useContext, useReducer } from "react";
import nextApi from "../../services/nextApi";
import { emptyFunction } from "../../utils";

export const USER_UPDATE_ACTION = 'UPDATE';
export const USER_LOGOUT_ACTION = 'LOGOUT';

const UserContext = createContext(null);
const UserDispatchContext = createContext(emptyFunction);

export default function UserProvider({ user, children }) {
  const [initialUser, dispatch] = useReducer(userReducer, user);
  return <UserContext.Provider value={ initialUser }>
    <UserDispatchContext.Provider value={ dispatch }>
      { children }
    </UserDispatchContext.Provider>
  </UserContext.Provider>
}

export function useUser() {
  return useContext(UserContext);
}

export function useIsLogin() {
  const user = useContext(UserContext);
  return !!user;
}

export function useUserDispatch() {
  return useContext(UserDispatchContext);
}

function userReducer(post, action) {
  if (action.type === USER_UPDATE_ACTION) {
    return action.user;
  } else if (action.type === USER_LOGOUT_ACTION) {
    return null
  }

  throw new Error(`Unknown user action: ${ action.type }`)
}

export function updateUser(user, dispatch) {
  dispatch({
    type: USER_UPDATE_ACTION,
    user,
  });
}

export async function fetchAndUpdateUser(dispatch) {
  const { result, error } = await nextApi.fetch(
    "user/profile",
    {},
    {
      method: "GET",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (result) {
    updateUser(result, dispatch);
  }
  if (error && error.status === 401) {
    updateUser(null, dispatch);
  }
}

export async function logoutUser(dispatch) {
  await nextApi.post("auth/logout");
  dispatch({ type: USER_LOGOUT_ACTION });
}
