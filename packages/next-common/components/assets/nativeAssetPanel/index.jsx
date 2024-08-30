import React, { memo, useCallback, useState } from "react";
import { TabLabel } from "next-common/components/assets/tabs/index";

const NativeAssetLabel = TabLabel;

const NativeAssetPanel = ({ children }) => {
  const [count, setCount] = useState("");

  const setTotalCount = useCallback((newCount) => {
    setCount(newCount);
  }, []);

  return (
    <div className="mb-1">
      <div className="pl-6">
        <NativeAssetLabel label="Native Assets" count={count} isActive={true} />
      </div>
      <div className="mt-4">
        {React.cloneElement(children, { setTotalCount })}
      </div>
    </div>
  );
};

export default memo(NativeAssetPanel);
