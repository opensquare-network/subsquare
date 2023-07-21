import { ArrowExpend } from "@osn/icons/subsquare";
import { SecondaryCard } from "./secondaryCard";
import { useState } from "react";
import Popup from "next-common/components/popup/wrapper/Popup";

export default function ChartCard({
  enlargable,
  popupHeadExtra,
  chart,
  popupChart,
  title,
  titleExtra,
  className = "",
}) {
  const [open, setOpen] = useState(false);

  return (
    <SecondaryCard className={className}>
      <div className="flex justify-between items-center mb-6">
        {title && <div>{title}</div>}

        {(titleExtra || enlargable) && (
          <div className="flex items-center gap-x-4">
            {titleExtra}
            {enlargable && (
              <ArrowExpend
                role="button"
                className="w-4 h-4 [&_path]:fill-textSecondary"
                onClick={() => setOpen(true)}
              />
            )}
          </div>
        )}
      </div>

      {chart}

      {open && (
        <Popup
          className="w-[960px] h-[600px]"
          title={title}
          onClose={() => setOpen(false)}
        >
          {popupHeadExtra && (
            <div className="mb-2 flex justify-end">
              <div>{popupHeadExtra}</div>
            </div>
          )}
          <div className="!mt-6">{popupChart || chart}</div>
        </Popup>
      )}
    </SecondaryCard>
  );
}
