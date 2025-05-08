import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loading from "../loading";
import ChainIcon from "./chainIcon";
import { ArrowDown } from "@osn/icons/subsquare";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import { useWindowSize } from "react-use";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import { useChainSettings } from "next-common/context/chain";
import SecondaryButton from "next-common/lib/button/secondary";
import * as Popover from "@radix-ui/react-popover";
import { NeutralPanel } from "../styled/containers/neutralPanel";
import { cn } from "next-common/utils";
import { useScanHeight } from "next-common/hooks/scanHeight";

const NetworkOptions = dynamicClientOnly(() => import("./networkOptions"));

function useHeaderHeight() {
  const nodesHeight = useScanHeight();
  const chainHeight = useSelector(latestHeightSelector);
  const { noScan } = useChainSettings();

  return noScan ? chainHeight : nodesHeight;
}

export default function NetworkSwitch({ activeNode }) {
  const [show, setShow] = useState(false);
  const windowSize = useWindowSize();
  const nodesHeight = useHeaderHeight();

  useEffect(() => {
    if (windowSize.width && windowSize.width <= 768) {
      setShow(false);
    }
  }, [windowSize]);

  let heightComponent;
  if (nodesHeight) {
    heightComponent = <span>{`#${nodesHeight?.toLocaleString()}`}</span>;
  } else {
    heightComponent = <Loading size={16} />;
  }

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
            <div>{activeNode?.name}</div>
          ) : (
            heightComponent
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
