import { useLoginPopup } from "next-common/hooks/useLoginPopup";
import { useEffect } from "react";
import { useRouter } from "next/router";
import LoginPopup from "./popup";
import { useSelector } from "react-redux";
import { initViewSelector } from "next-common/store/reducers/userSlice";

export default function LoginGlobalPopup() {
  const initView = useSelector(initViewSelector);
  const { loginPopupOpen, closeLoginPopup } = useLoginPopup();
  const router = useRouter();

  useEffect(() => {
    closeLoginPopup();
  }, [router.pathname]);

  return (
    loginPopupOpen && (
      <LoginPopup onClose={closeLoginPopup} initView={initView} />
    )
  );
}
