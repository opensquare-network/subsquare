import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loading from "../loading";
import ChainIcon from "./chainIcon";
import { ArrowDown } from "@osn/icons/subsquare";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import { useWindowSizeContext } from "next-common/context/windowSize";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import { useChain, useChainSettings } from "next-common/context/chain";
import SecondaryButton from "next-common/lib/button/secondary";
import * as Popover from "@radix-ui/react-popover";
import { NeutralPanel } from "../styled/containers/neutralPanel";
import { cn } from "next-common/utils";
import { useScanHeight } from "next-common/hooks/scanHeight";
import { useCoretimeScanHeight } from "next-common/hooks/coretimeScanHeight";
import { isCoretimeChain } from "next-common/utils/chain";

const NetworkOptions = dynamicClientOnly(() => import("./networkOptions"));

function useHeaderHeight() {
  const chain = useChain();
  const nodesHeight = useScanHeight();
  const chainHeight = useSelector(latestHeightSelector);
  const { noScan } = useChainSettings();
  const coretimeScanHeight = useCoretimeScanHeight();

  if (isCoretimeChain(chain)) {
    return coretimeScanHeight;
  }

  return noScan ? chainHeight : nodesHeight;
}

function NetworkEntryWithBlockHeight() {
  const nodesHeight = useHeaderHeight();
  if (!nodesHeight) {
    return <Loading size={16} />;
  }

  return <span>{`#${nodesHeight?.toLocaleString()}`}</span>;
}

function NetworkEntryWithChainName({ activeNode }) {
  return <div>{activeNode?.name}</div>;
}

export default function NetworkSwitch({ activeNode }) {
  const [show, setShow] = useState(false);
  const windowSize = useWindowSizeContext();

  useEffect(() => {
    if (windowSize.width && windowSize.width <= 768) {
      setShow(false);
    }
  }, [windowSize]);

  return (
    <Popover.Root open={show} onOpenChange={setShow}>
      <Popover.Trigger asChild>
        <SecondaryButton
          className="max-sm:w-full max-sm:justify-between"
          iconLeft={<ChainIcon chain={activeNode.value} />}
          iconRight={<ArrowDown className="[&_path]:stroke-textTertiary" />}
          onClick={() => {
            setShow(!show);
          }}
        >
          {activeNode?.hideHeight ? (
            <NetworkEntryWithChainName activeNode={activeNode} />
          ) : (
            <NetworkEntryWithBlockHeight />
          )}
        </SecondaryButton>
      </Popover.Trigger>

      <Popover.Content sideOffset={4} align="end" asChild>
        <NeutralPanel
          className={cn(
            "z-50",
            "max-h-[calc(100vh-73px)]",
            "overflow-y-scroll scrollbar-hidden",
            "p-2",
            "text14Medium",
            "outline-none",
            "max-sm:max-h-[60vh]",
            "max-sm:w-[calc(100vw-32px)]",
          )}
          style={{
            boxShadow: "var(--shadow200)",
          }}
        >
          <NetworkOptions activeNode={activeNode} setShow={setShow} />
        </NeutralPanel>
      </Popover.Content>
    </Popover.Root>
  );
}
