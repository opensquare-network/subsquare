import { SystemClose } from "@osn/icons/subsquare";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import { CACHE_KEY } from "next-common/utils/constants";
import { useCookieValue } from "next-common/utils/hooks/useCookieValue";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AccountDelegationPrompt() {
  const [show, setShow] = useState(false);
  const [value, setValue] = useCookieValue(CACHE_KEY.delegationPrompt, true);

  useEffect(() => {
    setShow(value);
  }, [value]);

  function close() {
    setValue(false, { expires: 15 });
  }

  return (
    show && (
      <GreyPanel className="!bg-theme100 text-theme500 text14Medium py-2.5 px-4 justify-between">
        <div>
          No time to vote? Delegate your votes to an expert{" "}
          <Link className="underline" href={"/delegation"}>
            here
          </Link>
        </div>

        <SystemClose className="w-5 h-5" role="button" onClick={close} />
      </GreyPanel>
    )
  );
}
