import clsx from "clsx";
import flatten from "lodash.flatten";
import CirclePacking from "next-common/components/charts/circlePacking";
import Tooltip from "next-common/components/tooltip";
import { useNavCollapsed } from "next-common/context/nav";
import { useLayoutEffect, useRef, useState } from "react";
import { useEventListener } from "usehooks-ts";
import VotesStatsLegend from "./legend";

/**
 * @param {{ allAye: any[], allNay: any[], allAbstain: any[]} & import("react").HTMLAttributes<HTMLDivElement>} props
 */
export default function VotesStats({ allAye, allNay, allAbstain, ...props }) {
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
  );

  // cache size, avoid re-render circle packing chart
  const [size, setSize] = useState({ width: 0, height: 0 });
  const ref = useRef();
  const [navCollapsed] = useNavCollapsed();
  const [interactionNode, setInteractionNode] = useState(null);

  useLayoutEffect(() => {
    handleSize();
  }, [navCollapsed, ref.current]);

  useEventListener("resize", handleSize, ref.current);

  function handleSize() {
    const width = ref.current.offsetWidth;
    const height = ref.current.offsetHeight;
    setSize({ width, height });
  }

  function hoverDimClassName(node) {
    if (interactionNode) {
      if (
        (interactionNode.data.aye && node.data.aye) ||
        (interactionNode.data.aye === false && node.data.aye === false) ||
        (interactionNode.data.isAbstain && node.data.isAbstain)
      ) {
        return "opacity-100";
      }
      return "opacity-40";
    }
  }

  const data = {
    name: "root",
    children: votes,
  };

  return (
    <div className={clsx(props.className, "w-full")} {...props} ref={ref}>
      <CirclePacking
        data={data}
        width={size.width}
        height={320}
        sizeField="votes"
        bubbleCircleClassName={(node) =>
          clsx(
            node.data.aye && "fill-green300",
            node.data.aye === false && "fill-red300",
            node.data.isAbstain && "fill-neutral400",
            hoverDimClassName(node),
          )
        }
        bubbleCircleContent={(node) => (
          <div
            className={clsx(
              "h-full w-full rounded-full",
              hoverDimClassName(node),
            )}
            onMouseEnter={() => {
              setInteractionNode(node);
            }}
            onMouseLeave={() => {
              setInteractionNode(null);
            }}
          >
            <Tooltip
              className="!block h-full"
              content={<div>{node.data.account}</div>}
            >
              <div className="rounded-full w-full h-full">
                {/* TODO: identity */}
              </div>
            </Tooltip>
          </div>
        )}
      />

      <VotesStatsLegend
        className="mt-4"
        allAye={allAye}
        allNay={allNay}
        allAbstain={allAbstain}
        showVotes={showVotes}
        setShowVotes={setShowVotes}
      />
    </div>
  );
}
