import { SystemLoading } from "@osn/icons/subsquare";
import clsx from "clsx";
import flatten from "lodash.flatten";
import CirclePacking from "next-common/components/charts/circlePacking";
import { useNavCollapsed } from "next-common/context/nav";
import { useLayoutEffect, useRef, useState } from "react";
import { useEventListener } from "usehooks-ts";
import VoteBubbleContent from "./bubbleContent";
import VotesBubbleLegend from "./legend";

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
  }, [navCollapsed, ref.current]);

  useEventListener("resize", handleSize, ref.current);

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
    return (
      <div className="text-center text14Medium text-textTertiary py-4">
        No current votes
      </div>
    );
  }

  return (
    <>
      {isFirst && (
        <div className="py-4">
          <SystemLoading className="[&_path]:stroke-textTertiary mx-auto" />
        </div>
      )}

      <div className={clsx(isFirst && "h-0 opacity-0 overflow-hidden")}>
        <div
          className={clsx(props.className, "w-full h-[480px] max-sm:h-80")}
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
              clsx(
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
      </div>
    </>
  );
}
