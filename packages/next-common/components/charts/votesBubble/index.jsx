import clsx from "clsx";
import flatten from "lodash.flatten";
import CirclePacking from "next-common/components/charts/circlePacking";
import Tooltip from "next-common/components/tooltip";
import User from "next-common/components/user";
import { useNavCollapsed } from "next-common/context/nav";
import { useLayoutEffect, useRef, useState } from "react";
import { useEventListener } from "usehooks-ts";
import VotesBubbleHoverContent from "./hoverContent";
import VotesBubbleLegend from "./legend";
import { useRouter } from "next/router";

/**
 * @param {{ allAye: any[], allNay: any[], allAbstain: any[]} & import("react").HTMLAttributes<HTMLDivElement>} props
 */
export default function VotesBubble({
  allAye,
  allNay,
  allAbstain,
  sizeField,
  ...props
}) {
  const router = useRouter();
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
    <div
      className={clsx(props.className, "relative w-full")}
      {...props}
      ref={ref}
    >
      <CirclePacking
        keyField="account"
        sizeField={sizeField}
        data={data}
        width={size.width}
        height={320}
        bubbleClassName={(node) =>
          clsx(
            node.data.aye && "fill-green300",
            node.data.aye === false && "fill-red300",
            node.data.isAbstain && "fill-neutral400",
            hoverDimClassName(node),
          )
        }
        bubbleContent={(node) => {
          const d = node.r * 2;

          return (
            <Tooltip
              className={clsx(
                "!block h-full w-full rounded-full",
                hoverDimClassName(node),
              )}
              content={
                <VotesBubbleHoverContent node={node} sizeField={sizeField} />
              }
              onMouseEnter={() => {
                setInteractionNode(node);
              }}
              onMouseLeave={() => {
                setInteractionNode(null);
              }}
            >
              <div
                role="link"
                className={clsx(
                  "flex items-center justify-center cursor-pointer",
                  "rounded-full w-full h-full px-2",
                  // user
                  "[&_div]:truncate",
                  "[&_div_a]:truncate",
                )}
                onClick={() => {
                  router.push(`/user/${node.data.account}/votes`);
                  setInteractionNode(null);
                }}
              >
                {d >= 60 && (
                  <User
                    add={node.data.account}
                    showAvatar={false}
                    noEvent
                    noTooltip
                    ellipsis={false}
                    color={clsx(
                      node.data.aye && "var(--green500)",
                      node.data.aye === false && "var(--red500)",
                      node.data.isAbstain && "var(--textSecondary)",
                    )}
                  />
                )}
              </div>
            </Tooltip>
          );
        }}
      />

      <VotesBubbleLegend
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
