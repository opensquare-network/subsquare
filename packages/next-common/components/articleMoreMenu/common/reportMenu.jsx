import dynamicPopup from "next-common/lib/dynamic/popup";
import { useState } from "react";
import { ReportMenuItem } from "./menuItems";
import { noop } from "lodash-es";

const ReportPopup = dynamicPopup(() =>
  import("next-common/components/reportPopup"),
);

export default function ReportMenu({ setShow = noop }) {
  const [showReportPopup, setShowReportPopup] = useState(false);
  return (
    <div>
      <ReportMenuItem
        onClick={() => {
          setShow(false);
          setShowReportPopup(true);
        }}
      />
      {showReportPopup && <ReportPopup setShow={setShowReportPopup} />}
    </div>
  );
}
