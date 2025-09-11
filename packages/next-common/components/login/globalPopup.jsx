import { useLoginPopup } from "next-common/hooks/useLoginPopup";
import { useEffect } from "react";
import { useRouter } from "next/router";
import LoginPopup from "next-common/components/login/popup";

export default function LoginGlobalPopup() {
  const { loginPopupOpen, closeLoginPopup } = useLoginPopup();
  const router = useRouter();

  useEffect(() => {
    closeLoginPopup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname]);

  return loginPopupOpen && <LoginPopup onClose={closeLoginPopup} />;
}
