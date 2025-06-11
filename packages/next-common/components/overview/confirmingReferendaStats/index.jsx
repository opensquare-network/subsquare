import { useEffect, useState } from "react";
import Link from "next/link";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import { SystemClose } from "@osn/icons/subsquare";
import useConfirmingReferendaCount from "./useConfirmingReferendaCount";
import { useChainSettings } from "next-common/context/chain";
import { colorStyle, PromptTypes } from "next-common/components/scrollPrompt";

function Prompt({ setVisible, confirmingCount }) {
  return (
    <GreyPanel
      className="text14Medium py-2.5 px-4 justify-between"
      style={colorStyle[PromptTypes.INFO]}
    >
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

function ConfirmingReferendaStatsPrompt() {
  const { value, loading } = useConfirmingReferendaCount();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (loading || value <= 0) {
      return;
    }

    setVisible(true);
  }, [loading, value]);

  if (!visible) {
    return null;
  }

  return <Prompt confirmingCount={value} setVisible={setVisible} />;
}

export default function ConfirmingReferendaStats() {
  const { modules } = useChainSettings();
  if (!modules?.referenda) {
    return null;
  }

  return <ConfirmingReferendaStatsPrompt />;
}
