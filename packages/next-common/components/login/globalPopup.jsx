import { useLoginPopup } from "next-common/hooks/useLoginPopup";
import { useEffect } from "react";
import { useRouter } from "next/router";
import dynamicPopup from "next-common/lib/dynamic/popup";

// The Polkadot Vault option inside the login popup imports @polkadot/react-qr,
// a 600KB+ QR decoding library. This component is mounted in the global layout,
// so the popup has to be lazy loaded to keep that out of every page's first load.
const LoginPopup = dynamicPopup(() =>
  import("next-common/components/login/popup"),
);

export default function LoginGlobalPopup() {
  const { loginPopupOpen, closeLoginPopup } = useLoginPopup();
  const router = useRouter();

  useEffect(() => {
    closeLoginPopup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname]);

  return loginPopupOpen && <LoginPopup onClose={closeLoginPopup} />;
}
