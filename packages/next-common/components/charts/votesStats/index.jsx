import clsx from "clsx";
import flatten from "lodash.flatten";
import CirclePacking from "next-common/components/charts/circlePacking";
import VoteLabel from "next-common/components/democracy/flattenedVotesPopup/voteLabel";
import Tooltip from "next-common/components/tooltip";
import User from "next-common/components/user";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { useNavCollapsed } from "next-common/context/nav";
import { detailMultiTabsVotesStatsView } from "next-common/store/reducers/detailSlice";
import { toPrecision } from "next-common/utils";
import { useLayoutEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useEventListener } from "usehooks-ts";
import VotesStatsLegend from "./legend";

/**
 * @param {{ allAye: any[], allNay: any[], allAbstain: any[]} & import("react").HTMLAttributes<HTMLDivElement>} props
 */
export default function VotesStats({
  allAye,
  allNay,
  allAbstain,
  sizeField,
  ...props
}) {
  const chainSettings = useChainSettings();
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
  const view = useSelector(detailMultiTabsVotesStatsView);

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

  console.log(interactionNode);

  return (
    <div className={clsx(props.className, "w-full")} {...props} ref={ref}>
      <CirclePacking
        sizeField={sizeField}
        data={data}
        width={size.width}
        height={320}
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
            {node.r * 2 >= 60 && (
              <Tooltip
                className="!block h-full p-2"
                content={
                  <ul>
                    <li>{node.data.account}</li>
                    {view === "flattened" && (
                      <li>
                        Capital:{" "}
                        <ValueDisplay
                          value={toPrecision(
                            node.data.balance,
                            chainSettings.decimals,
                          )}
                          symbol={chainSettings.symbol}
                        />
                        (<VoteLabel {...node.data} />)
                      </li>
                    )}
                    {view === "nested" && (
                      <li>
                        Delegators: {node.data.directVoterDelegations?.length}
                      </li>
                    )}
                    <li>
                      Votes:{" "}
                      <ValueDisplay
                        value={toPrecision(
                          node.data[sizeField],
                          chainSettings.decimals,
                        )}
                        symbol={chainSettings.symbol}
                      />
                    </li>
                  </ul>
                }
                keepTooltipOpenAfterClick
              >
                <UserWrapper>
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
                </UserWrapper>
              </Tooltip>
            )}
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

/**
 * @description hide identity icon, truncate user address or identity name
 */
function UserWrapper({ children }) {
  return (
    <div
      className={clsx(
        "flex items-center justify-center",
        "rounded-full w-full h-full",

        // user
        "[&_div]:truncate",
        "[&_div_a]:truncate",
        // user, hide identity icon
        "[&_a_svg]:hidden",
      )}
    >
      {children}
    </div>
  );
}
