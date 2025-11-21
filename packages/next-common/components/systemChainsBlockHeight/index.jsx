import { useState } from "react";
import { useChain } from "next-common/context/chain";
import useChainOrScanHeight from "next-common/hooks/height";
import SecondaryButton from "next-common/lib/button/secondary";
import Tooltip from "next-common/components/tooltip";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { isRelayChain } from "next-common/utils/chain";

const SystemChainsBlockHeightPopup = dynamicPopup(() => import("./popup"));

function SystemChainsBlockHeightImpl() {
  const [show, setShow] = useState(false);
  const latestHeight = useChainOrScanHeight();

  return (
    <div>
      <Tooltip content="Click to see more system chains' status">
        <SecondaryButton
          className="max-sm:w-full max-sm:justify-between border-none text-textSecondary hover:text-textPrimary pr-0"
          onClick={() => setShow(true)}
        >
          {`#${latestHeight?.toLocaleString()}`}
        </SecondaryButton>
      </Tooltip>
      {show && <SystemChainsBlockHeightPopup setShow={setShow} />}
    </div>
  );
}

export default function SystemChainsBlockHeight() {
  const chain = useChain();
  if (!isRelayChain(chain)) {
    return null;
  }

  return <SystemChainsBlockHeightImpl />;
}
