import { memo } from "react";
import DesktopList from "next-common/components/multisigs/desktop";
import MobileList from "next-common/components/multisigs/mobile";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import { CallPopupInContext } from "next-common/components/multisigs/callPopup";

function CommonMultisigsTable({ multisigs, isLoading }) {
  const { width } = useWindowSize();

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
