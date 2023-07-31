import {
  loginOpenSelector,
  setLoginOpen,
} from "next-common/store/reducers/userSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

export function useLoginPopup() {
  const loginPopupOpen = useSelector(loginOpenSelector);
  const dispatch = useDispatch();

  function toggleLogin(bool) {
    dispatch(setLoginOpen(bool));
  }

  return {
    loginPopupOpen,
    openLoginPopup: () => toggleLogin(true),
    closeLoginPopup: () => toggleLogin(false),
  };
}
