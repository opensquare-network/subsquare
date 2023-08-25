import clsx from "clsx";
import noop from "lodash.noop";

export default function VotesBubbleLegend({
  className = "",
  allAye,
  allNay,
  allAbstain,
  showVotes,
  setShowVotes = noop,
}) {
  const items = [
    allAye && {
      key: "aye",
      label: "Aye",
      circleClassName: "bg-green300 border-green500",
    },
    allNay && {
      key: "nay",
      label: "Nay",
      circleClassName: "bg-red300 border-red500",
    },
    allAbstain && {
      key: "abstain",
      label: "Abstain",
      circleClassName: "bg-neutral400 border-neutral500",
    },
  ].filter(Boolean);

  function onLegendClick(item) {
    const newShowVotesValue = {
      ...showVotes,
      [item.key]: !showVotes[item.key],
    };

    const allFalse = Object.values(newShowVotesValue).every((v) => !v);
    if (allFalse) {
      return;
    }

    setShowVotes(newShowVotesValue);
  }

  return (
    <ul className={clsx(className, "flex gap-x-4 justify-center")}>
      {items.map((item) => (
        <li
          key={item.key}
          className={clsx(
            "flex gap-x-2 items-center",
            "text12Medium select-none cursor-pointer",
            showVotes[item.key] ? "text-textSecondary" : "text-textDisabled",
          )}
          onClick={() => {
            onLegendClick(item);
          }}
        >
          <Circle
            className={item.circleClassName}
            disabled={!showVotes[item.key]}
          />
          {item.label}
        </li>
      ))}
    </ul>
  );
}

function Circle({ className = "", disabled }) {
  return (
    <span
      className={clsx(
        className,
        "w-2.5 h-2.5 border rounded-full",
        disabled && "!bg-neutral200 !border-neutral400",
      )}
    />
  );
}
