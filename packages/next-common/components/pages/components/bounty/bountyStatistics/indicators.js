import { AddressUser } from "next-common/components/user";
import { formatNum } from "next-common/utils";
import Tooltip from "next-common/components/tooltip";

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
  const { backgroundColor, data: fiatAtFinals } = datasets[0];

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
                className="w-[12px] h-[12px] rounded-[2px] inline-block mr-2"
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
            </div>
          </div>
        </Tooltip>
      ))}
    </div>
  );
}
