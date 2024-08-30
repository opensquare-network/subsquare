import React, { memo } from "react";
import { TabLabel } from "next-common/components/assets/tabs/index";

const NativeAssetLabel = TabLabel;

const NativeAssetPanel = ({ children }) => {
  const [count, setCount] = React.useState("");

  return (
    <div className="mb-6">
      <NativeAssetLabel label="Native Assets" count={count} isActive={true} />
      <div className="mt-4">
        {React.cloneElement(children, { setTotalCount: setCount })}
      </div>
    </div>
  );
};

export default memo(NativeAssetPanel);
