import { useLoginPopup } from "next-common/hooks/useLoginPopup";
import { useEffect } from "react";
import { useRouter } from "next/router";
import LoginPopup from "./popup";

export default function LoginGlobalPopup() {
  const { loginPopupOpen, closeLoginPopup } = useLoginPopup();
  const router = useRouter();

  useEffect(() => {
    closeLoginPopup();
  }, [router.pathname]);

  return loginPopupOpen && <LoginPopup onClose={closeLoginPopup} />;
}
