import { SystemLoading } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";
import { flatten } from "lodash-es";
import CirclePacking from "next-common/components/charts/circlePacking";
import { useNavCollapsed } from "next-common/context/nav";
import { useLayoutEffect, useRef, useState } from "react";
import { useEvent } from "react-use";
import VoteBubbleContent from "./bubbleContent";
import VotesBubbleLegend from "./legend";
import DVBubbleLegend from "./DVBubbleLegend";
import NoData from "next-common/components/noData";
import { useChain } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";

export default function VotesBubble({
  allAye,
  allNay,
  allAbstain,
  sizeField,
  ...props
}) {
  const hasVotes = !![
    allAye?.length,
    allNay?.length,
    allAbstain?.length,
  ].filter(Boolean).length;

  const chain = useChain();
  const [showVotes, setShowVotes] = useState({
    aye: true,
    nay: true,
    abstain: true,
  });

  const votes = flatten(
    [
      showVotes.aye && allAye,
      showVotes.nay && allNay,
      showVotes.abstain && allAbstain,
    ].filter(Boolean),
  ).sort((a, b) => b[sizeField] - a[sizeField]);

  // cache size, avoid re-render circle packing chart
  const [size, setSize] = useState({ width: 0, height: 0 });
  const ref = useRef();
  const [navCollapsed] = useNavCollapsed();
  const [isFirst, setIsFirst] = useState(true);

  useLayoutEffect(() => {
    handleSize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navCollapsed, ref.current]);

  useEvent("resize", handleSize);

  function handleSize() {
    if (!ref.current) return;
    const width = ref.current.clientWidth;
    const height = ref.current.clientHeight;
    setSize({ width, height });
  }

  const chartData = {
    name: "root",
    children: votes,
  };

  if (!hasVotes) {
    return <NoData text="No votes data" />;
  }

  return (
    <>
      {isFirst && (
        <div className="py-4">
          <SystemLoading className="[&_path]:stroke-textTertiary mx-auto" />
        </div>
      )}

      <div className={cn(isFirst && "h-0 opacity-0 overflow-hidden")}>
        <div
          className={cn(props.className, "w-full h-[480px] max-sm:h-80")}
          {...props}
          ref={ref}
        >
          <CirclePacking
            data={chartData}
            keyField="account"
            sizeField={sizeField}
            width={size.width}
            height={size.height}
            bubbleClassName={(node) =>
              cn(
                node.data.aye && "fill-green300 stroke-green500",
                node.data.aye === false && "fill-red300 stroke-red500",
                node.data.isAbstain && "fill-neutral400 stroke-neutral500",
              )
            }
            renderBubbleContent={(node) => (
              <VoteBubbleContent node={node} sizeField={sizeField} />
            )}
            onReady={() => {
              setIsFirst(false);
            }}
          />
        </div>

        <VotesBubbleLegend
          className="mt-4"
          allAye={allAye}
          allNay={allNay}
          allAbstain={allAbstain}
          showVotes={showVotes}
          setShowVotes={setShowVotes}
        />

        {[Chains.polkadot, Chains.kusama].includes(chain) &&
          sizeField === "totalVotes" && (
            <DVBubbleLegend className="mt-6" allAye={allAye} allNay={allNay} />
          )}
      </div>
    </>
  );
}
