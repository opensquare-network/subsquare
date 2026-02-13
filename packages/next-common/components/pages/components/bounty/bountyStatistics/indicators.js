import { AddressUser } from "next-common/components/user";
import { formatNum } from "next-common/utils";
import Tooltip from "next-common/components/tooltip";
import { MAX_CURATORS_FOR_DOUGHNUT } from "./common";

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
  const showDoughnut = rawData.length <= MAX_CURATORS_FOR_DOUGHNUT;

  return (
    <div className="flex flex-1 flex-col gap-y-2 justify-center text12Medium">
      {labels.map((label, index) => (
        <Tooltip
          key={index}
          content={TooltipContent && <TooltipContent data={rawData[index]} />}
        >
          <div
            role="button"
            className="flex justify-between items-center"
            {...(onClick && { onClick: () => onClick(index) })}
          >
            <div
              className="flex items-center"
              {...(!TooltipContent && {
                title: `${label} ${formatNum(fiatAtFinals[index])}`,
              })}
            >
              <span
                className="!w-[12px] !h-[12px] flex-shrink-0 flex-grow-0 rounded-[2px] inline-block mr-2"
                style={{ backgroundColor: backgroundColor[index] }}
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
                {formatNum(fiatAtFinals[index])}
              </span>
              {!showDoughnut && (
                <span className="text-textPrimary ml-4">
                  ({percentages[index]})
                </span>
              )}
            </div>
          </div>
        </Tooltip>
      ))}
    </div>
  );
}
