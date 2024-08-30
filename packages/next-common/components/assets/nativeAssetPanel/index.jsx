import React, { memo } from "react";
import { TabLabel } from "next-common/components/assets/tabs/index";

const NativeAssetPanel = ({ children }) => {

  return (
    <div className="mb-1">
      <div className="pl-6">
        <span className="font-bold text-[16px] leading-[24px] text-textPrimary">
          Native Asset
        </span>
      </div>
      <div className="mt-4">
        {React.cloneElement(children)}
      </div>
    </div>
  );
};

export default memo(NativeAssetPanel);
