import { useLoginPopup } from "next-common/hooks/useLoginPopup";
import { useEffect } from "react";
import { useRouter } from "next/router";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";

const LoginPopup = dynamicClientOnly(() =>
  import("next-common/components/login/globalPopup"),
);

export default function LoginGlobalPopup() {
  const { loginPopupOpen, closeLoginPopup } = useLoginPopup();
  const router = useRouter();

  useEffect(() => {
    closeLoginPopup();
  }, [router.pathname]);

  return loginPopupOpen && <LoginPopup onClose={closeLoginPopup} />;
}
