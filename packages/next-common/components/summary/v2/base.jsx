import Divider from "next-common/components/styled/layout/divider";
import SummaryItems from "../summaryItems";
import clsx from "clsx";

export default function Summary({ items = [], footer, chart }) {
  return (
    <div>
      <div className="flex max-sm:block">
        <SummaryItems
          items={items}
          className={clsx("w-full", chart && "grid grid-cols-2 gap-4")}
        />

        {chart}
      </div>

      {footer && (
        <>
          <Divider margin={16} />
          {footer}
        </>
      )}
    </div>
  );
}
