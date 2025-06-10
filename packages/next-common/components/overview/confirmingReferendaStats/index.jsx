import { useEffect, useState } from "react";
import Link from "next/link";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import { SystemClose } from "@osn/icons/subsquare";
import useConfirmingReferendaCount from "./useConfirmingReferendaCount";

function Prompt({ visible, setVisible, confirmingCount = 0 }) {
  if (!visible) {
    return null;
  }

  return (
    <GreyPanel className="bg-theme100 text-theme500 text14Medium py-2.5 px-4 justify-between">
      <p className="inline-flex">
        <span>There&nbsp;{confirmingCount > 1 ? "are" : "is"}</span>
        <span className="text14Bold">&nbsp;{confirmingCount}&nbsp;</span>
        <span>
          referenda confirming. Check {confirmingCount > 1 ? "them" : "it"}
          &nbsp;
        </span>
        <Link className="underline text14Bold" href="/referenda">
          here
        </Link>
        <span>.</span>
      </p>
      <SystemClose
        className="w-5 h-5 text-theme500"
        role="button"
        onClick={() => {
          setVisible(false);
        }}
      />
    </GreyPanel>
  );
}

export default function ConfirmingReferendaStats() {
  const { value, loading } = useConfirmingReferendaCount();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (loading || !value) {
      return;
    }

    setVisible(true);
  }, [loading, value]);

  return (
    <Prompt
      confirmingCount={value || 0}
      setVisible={setVisible}
      visible={visible}
    />
  );
}
