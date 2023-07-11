import React, { memo } from "react";
import Accordion from "./accordion";
import Descriptions from "../Descriptions";

function MultiKVList({ data = [], title, showFold = true }) {
  if (!data || data?.length === 0) {
    return null;
  }

  return (
    <Accordion title={title} showFold={showFold}>
      <div className="space-y-4">
        {data.map((itemData, idx) => {
          const descriptionsItems = itemData.map((item) => {
            const [label, value] = item ?? [];
            if (typeof label === "string") {
              return { label, value };
            } else {
              // custom content
              return { content: label };
            }
          });

          return (
            <Descriptions
              key={idx}
              items={descriptionsItems}
              labelWidth={160}
              valueAlign="left"
            />
          );
        })}
      </div>
    </Accordion>
  );
}

export default memo(MultiKVList);
