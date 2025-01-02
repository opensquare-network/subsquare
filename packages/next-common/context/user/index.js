import React, { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import nextApi from "../../services/nextApi";
import { isKeyRegisteredUser } from "next-common/utils";

const UserContext = createContext(null);

export default function UserProvider({
  user: _user,
  userStatus: _userStatus,
  children,
}) {
  const [user, setUser] = useState(_user);
  const [userStatus, setUserStatus] = useState(_userStatus);
  useEffect(() => {
    setUser(_user);
    setUserStatus(_userStatus);
  }, [_user, _userStatus]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        userStatus,
        setUserStatus,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}

export function useUser() {
  const { user } = useUserContext();
  return user;
}

export function useSetUser() {
  const { setUser } = useUserContext();
  return setUser;
}

export function useIsLoggedIn() {
  const { userStatus } = useUserContext();
  return userStatus?.isLoggedIn;
}

export function useIsWeb3User() {
  const { user, userStatus } = useUserContext();
  return user && (!userStatus?.isSignedUp || isKeyRegisteredUser(user));
}

export function useIsAccountConnectedOnly() {
  const { user, userStatus } = useUserContext();
  return user && !userStatus?.isLoggedIn;
}

export async function fetchAndUpdateUser(userContext) {
  const { setUser, setUserStatus } = userContext;

  const options = {
    method: "GET",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
  };
  const [{ result: user }, { result: userStatus }] = await Promise.all([
    nextApi.fetch("user/profile", {}, options),
    nextApi.fetch("user/status", {}, options),
  ]);

  setUser(user ?? null);
  setUserStatus(userStatus ?? null);
}

export async function fetchAndUpdateUserStatus(userContext) {
  const { setUserStatus } = userContext;

  const { result: userStatus } = await nextApi.fetch(
    "user/status",
    {},
    {
      method: "GET",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
    },
  );

  setUserStatus(userStatus ?? null);
}

export async function logoutUser(userContext) {
  const { setUser, setUserStatus } = userContext;
  await nextApi.post("auth/logout");
  setUser(null);
  setUserStatus(null);
}
