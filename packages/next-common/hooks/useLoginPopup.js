import { store } from "next-common/store";
import {
  loginOpenSelector,
  setLoginOpen,
  setLoginResult,
} from "next-common/store/reducers/userSlice";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

export function useLoginPopup() {
  const loginPopupOpen = useSelector(loginOpenSelector);
  const dispatch = useDispatch();

  function toggleLogin(show) {
    dispatch(setLoginOpen(show));
  }

  const waitForClose = useCallback(() => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const { user } = store.getState();
        if (!user.loginOpen) {
          clearInterval(interval);
          resolve(user.loginResult);
        }
      }, 100);
    });
  }, []);

  return {
    loginPopupOpen,
    openLoginPopup: () => {
      dispatch(setLoginResult(null));
      toggleLogin(true);
    },
    closeLoginPopup: () => {
      toggleLogin(false, null);
    },
    waitForClose,
  };
}
