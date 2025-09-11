import React from "react";
import PopupLabel from "next-common/components/popup/label";

export default function RelatedReferenda({ relatedReferenda }) {
  if (!relatedReferenda || relatedReferenda?.length <= 0) {
    return null;
  }

  return (
    <div>
      <PopupLabel text="Related referenda" />
      <div className="text-[12px] font-medium text-textPrimary py-[12px] border-b border-b-neutral300">
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
