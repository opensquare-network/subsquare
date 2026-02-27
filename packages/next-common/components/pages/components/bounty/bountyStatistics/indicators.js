import { AddressUser } from "next-common/components/user";
import { formatNum } from "next-common/utils";
import Tooltip from "next-common/components/tooltip";
import { MAX_CURATORS_FOR_DOUGHNUT } from "./common";
import { isEmpty } from "lodash-es";

export function Indicator({
  label,
  index,
  fiatAtFinal,
  backgroundColor,
  isAddress,
  onClick,
  TooltipContent,
  rawDatum,
  percentage,
  showPercentage,
}) {
  return (
    <Tooltip
      key={index}
      content={TooltipContent && <TooltipContent data={rawDatum} />}
    >
      <div
        className="flex justify-between items-center"
        {...(onClick && { onClick: () => onClick(index), role: "button" })}
      >
        <div
          className="flex items-center"
          {...(!TooltipContent && {
            title: `${label} ${formatNum(fiatAtFinal)}`,
          })}
        >
          <span
            className="!w-[12px] !h-[12px] flex-shrink-0 flex-grow-0 rounded-[2px] inline-block mr-2"
            style={{ backgroundColor }}
          />
          <span className="text-textPrimary">
            {isAddress ? (
              <AddressUser
                add={label}
                noEvent={true}
                className="text12Medium"
              />
            ) : (
              label
            )}
          </span>
          <span className="text-textPrimary ml-1">
            {formatNum(fiatAtFinal)}
          </span>
          {showPercentage && (
            <span className="text-textPrimary ml-4">({percentage})</span>
          )}
        </div>
      </div>
    </Tooltip>
  );
}

export default function Indicators({
  data,
  isAddress = false,
  onClick,
  TooltipContent,
}) {
  if (!data) {
    return null;
  }

  const { labels, datasets, rawData } = data;
  const {
    backgroundColor,
    data: fiatAtFinals,
    percentage: percentages,
  } = datasets[0];
  const showPercentage = rawData.length > MAX_CURATORS_FOR_DOUGHNUT;

  return (
    <div className="flex flex-1 flex-col gap-y-2 justify-center text12Medium">
      {labels.map((label, index) => (
        <Indicator
          key={index}
          label={label}
          index={index}
          fiatAtFinal={fiatAtFinals[index]}
          backgroundColor={backgroundColor[index]}
          isAddress={isAddress}
          TooltipContent={TooltipContent}
          rawDatum={rawData[index]}
          percentage={percentages[index]}
          showPercentage={showPercentage}
          {...(onClick &&
            !isEmpty(rawData[index]?.childBounties) && {
              onClick: () => onClick(index),
            })}
        />
      ))}
    </div>
  );
}
