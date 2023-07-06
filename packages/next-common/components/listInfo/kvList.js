import Descriptions from "../Descriptions";
import Accordion from "./accordion";

export default function KVList({ data = [], title, showFold = true }) {
  if (!data || data?.length === 0) {
    return null;
  }

  const descriptionsItems = data.map((item) => {
    const [label, value] = item ?? [];
    if (typeof label === "string") {
      return { label, value };
    } else {
      // custom content
      return { content: label };
    }
  });

  return (
    <Accordion title={title} showFold={showFold}>
      <Descriptions
        items={descriptionsItems}
        labelWidth={160}
        valueAlign="left"
      />
    </Accordion>
  );
}
