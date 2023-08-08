import React from "react";
import PopupLabel from "next-common/components/popup/label";

export default function RelatedReferenda({ relatedReferenda }) {
  return (
    <div>
      <PopupLabel text="Related referenda" />
      <div className="text-[12px] font-medium text-textPrimary">
        {relatedReferenda.length ? (
          relatedReferenda
            .map((referendumIndex) => `#${referendumIndex}`)
            .join(", ")
        ) : (
          <span className="text-textTertiary">None</span>
        )}
      </div>
    </div>
  );
}
