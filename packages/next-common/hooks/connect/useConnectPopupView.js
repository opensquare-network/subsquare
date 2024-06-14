import {
  connectPopupViewSelector,
  setConnectPopupView,
} from "next-common/store/reducers/connectPopupSlice";
import { CONNECT_POPUP_DEFAULT_VIEW } from "next-common/utils/constants";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

export function useConnectPopupView() {
  const dispatch = useDispatch();
  const view = useSelector(connectPopupViewSelector);

  function setView(v) {
    dispatch(setConnectPopupView(v));
  }

  function reset() {
    dispatch(setConnectPopupView(CONNECT_POPUP_DEFAULT_VIEW));
  }

  return [view, setView, reset];
}
