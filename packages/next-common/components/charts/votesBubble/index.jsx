import clsx from "clsx";
import flatten from "lodash.flatten";
import CirclePacking from "next-common/components/charts/circlePacking";
import { useNavCollapsed } from "next-common/context/nav";
import { useLayoutEffect, useRef, useState } from "react";
import { useEventListener } from "usehooks-ts";
import VoteBubbleContent from "./bubbleContent";
import VotesBubbleLegend from "./legend";

/**
 * @param {{ allAye: any[], allNay: any[], allAbstain: any[], sizeField?: string} & import("react").HTMLAttributes<HTMLDivElement>} props
 */
export default function VotesBubble({
  allAye,
  allNay,
  allAbstain,
  sizeField,
  ...props
}) {
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

  useLayoutEffect(() => {
    handleSize();
  }, [navCollapsed, ref.current]);

  useEventListener("resize", handleSize, ref.current);

  function handleSize() {
    const width = ref.current.offsetWidth;
    const height = ref.current.offsetHeight;
    setSize({ width, height });
  }

  const chartData = {
    name: "root",
    children: votes,
  };

  return (
    <>
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
    </>
  );
}
