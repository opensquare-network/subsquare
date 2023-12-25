import { useLoginPopup } from "next-common/hooks/useLoginPopup";
import { useEffect } from "react";
import { useRouter } from "next/router";
import LoginPopup from "./popup";
import { useSelector } from "react-redux";
import {
  initViewSelector,
  setInitView,
} from "next-common/store/reducers/userSlice";
import { useDispatch } from "react-redux";

export default function LoginGlobalPopup() {
  const dispatch = useDispatch();
  const initView = useSelector(initViewSelector);
  const { loginPopupOpen, closeLoginPopup } = useLoginPopup();
  const router = useRouter();

  useEffect(() => {
    closeLoginPopup();
  }, [router.pathname]);

  return (
    loginPopupOpen && (
      <LoginPopup
        onClose={() => {
          dispatch(setInitView("web3"));
          closeLoginPopup();
        }}
        initView={initView}
      />
    )
  );
}
