import {
  loginOpenSelector,
  setLoginOpen,
  setRedirectUrl,
} from "next-common/store/reducers/userSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

export function useLoginPopup() {
  const loginPopupOpen = useSelector(loginOpenSelector);
  const dispatch = useDispatch();

  function toggleLogin(show, redirectUrl) {
    dispatch(setLoginOpen(show));
    dispatch(setRedirectUrl(redirectUrl));
  }

  return {
    loginPopupOpen,
    openLoginPopup: (redirectUrl) => toggleLogin(true, redirectUrl),
    closeLoginPopup: () => toggleLogin(false, null),
  };
}
