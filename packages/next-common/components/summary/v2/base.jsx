// TODO: delete summary items, the Summary is
import SummaryItems from "../summaryItems";

export default function Summary({ items = [], className = "" }) {
  return <SummaryItems items={items} className={className} />;
}
