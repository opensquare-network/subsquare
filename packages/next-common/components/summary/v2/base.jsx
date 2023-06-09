import Divider from "next-common/components/styled/layout/divider";
import SummaryItems from "../summaryItems";

export default function Summary({ items = [], footer }) {
  return (
    <div>
      <SummaryItems items={items} />

      {footer && (
        <>
          <Divider margin={16} />
          {footer}
        </>
      )}
    </div>
  );
}
