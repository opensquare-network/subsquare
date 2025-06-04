import { useEffect, useState } from "react";
import { useAcceptCookies } from "../../utils/hooks/useAcceptCookies";
import { isNil } from "lodash-es";
import { cn } from "next-common/utils";
import PrimaryButton from "next-common/lib/button/primary";
import { useNavCollapsed } from "next-common/context/nav";
import SecondaryButton from "next-common/lib/button/secondary";

export default function CookiesConsent() {
  const [show, setShow] = useState(false);
  const [isAcceptCookies, setIsAcceptCookies] = useAcceptCookies();
  useEffect(() => {
    setShow(isNil(isAcceptCookies));
  }, [isAcceptCookies]);
  const [navCollapsed] = useNavCollapsed();

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
      className={cn(
        "flex justify-center w-full",
        "fixed right-0 bottom-0",
        "bg-neutral100 shadow-100",
        "border border-neutral300",
        navCollapsed ? "max-w-[calc(100%-72px)]" : "max-w-[calc(100%-300px)]",
        "max-sm:max-w-none z-[1]",
      )}
    >
      <div
        className={cn("flex flex-wrap w-full gap-[24px] max-w-[1200px] p-6")}
      >
        <div>
          <p className="text-textPrimary text16Bold">We Use Cookies!</p>
          <p className="text14Medium text-textSecondary">
            This site uses cookies to improve your browsing experience, to show
            you personalized content, to analyze our website traffic.
          </p>
        </div>

        <div className="flex items-center grow justify-end gap-[8px]">
          <SecondaryButton onClick={handleIgnore}>Dismiss</SecondaryButton>
          <PrimaryButton onClick={handleAccept}>Accept</PrimaryButton>
        </div>
      </div>
    </div>
  );
}
