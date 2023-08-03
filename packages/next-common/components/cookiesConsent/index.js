import { useEffect, useState } from "react";
import { useAcceptCookies } from "../../utils/hooks/useAcceptCookies";
import isNil from "lodash.isnil";
import clsx from "clsx";
import { SystemClose } from "@osn/icons/subsquare";
import ThemeButton from "../buttons/themeButton";

export default function CookiesConsent() {
  const [show, setShow] = useState(false);
  const [isAcceptCookies, setIsAcceptCookies] = useAcceptCookies();
  useEffect(() => {
    setShow(isNil(isAcceptCookies));
  }, [isAcceptCookies]);

  function handleAccept() {
    setIsAcceptCookies(true, { expires: 30 });
    handleClose();
  }
  function handleIgnore() {
    setIsAcceptCookies(false, { expires: 15 });
    handleClose();
  }
  function handleClose() {
    setShow(false);
  }

  if (!show) {
    return null;
  }

  return (
    <div
      className={clsx(
        " w-[432px] max-sm:w-full",
        "fixed right-6 bottom-24",
        "max-sm:right-0 max-sm:left-0 max-sm:bottom-12",
      )}
    >
      <div
        className={clsx(
          "bg-neutral100 shadow-100",
          "border border-neutral300 rounded-lg p-6",
          "space-y-4",
        )}
      >
        <div className="flex justify-between items-center">
          <p className="text-textPrimary text16Bold">We Use Cookies!</p>
          <SystemClose
            className="[&_path]:fill-textTertiary"
            role="button"
            onClick={handleIgnore}
          />
        </div>

        <p className="text14Medium text-textSecondary">
          We use cookies to improve your experience on our site.
        </p>

        <div className="flex justify-end">
          <ThemeButton onClick={handleAccept}>Got it</ThemeButton>
        </div>
      </div>
    </div>
  );
}
