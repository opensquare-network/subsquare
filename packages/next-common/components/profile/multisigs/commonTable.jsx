import { memo } from "react";
import DesktopList from "next-common/components/multisigs/desktop";
import MobileList from "next-common/components/multisigs/mobile";
import { useWindowWidthContext } from "next-common/context/windowSize";
import { CallPopupInContext } from "next-common/components/multisigs/callPopup";

function CommonMultisigsTable({ multisigs, isLoading }) {
  const width = useWindowWidthContext();

  return (
    <div>
      {width > 1024 ? (
        <DesktopList multisigs={multisigs} isLoading={isLoading} />
      ) : (
        <MobileList multisigs={multisigs} isLoading={isLoading} />
      )}
      <CallPopupInContext />
    </div>
  );
}

export default memo(CommonMultisigsTable);
