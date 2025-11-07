import FieldLoading from "next-common/components/icons/fieldLoading";
import { isEmpty } from "lodash-es";
import { cn } from "next-common/utils";

export default function SpendPeriod({ summary }) {
  if (isEmpty(summary)) {
    return <FieldLoading />;
  }

  const renderItems = (items, textStyle, isEvenCondition, firstElementStyle) =>
    (items || []).map((item, index) => (
      <span
        className={cn(
          textStyle,
          isEvenCondition(index) && "!ml-0",
          index === 0 && firstElementStyle,
        )}
        key={index}
      >
        {item}
      </span>
    ));

  return (
    <>
      {renderItems(
        summary?.spendPeriod,
        "text12Medium text-textPrimary",
        (index) => index % 2 === 1,
      )}

      {renderItems(
        summary?.totalPeriod,
        "text12Medium text-textTertiary",
        (index) => index % 2 === 0,
        "!ml-1",
      )}
    </>
  );
}
