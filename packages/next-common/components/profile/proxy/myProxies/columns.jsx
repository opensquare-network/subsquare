import AddressUser from "next-common/components/user/addressUser";
import { useState } from "react";
import { formatTimeDuration } from "next-common/utils/viewfuncs/formatTimeDuration";

export const delegateeColumn = {
  name: "Delegatee",
  render(data) {
    return <AddressUser key={data?.delegate} add={data?.delegate} />;
  },
};

export const typeColumn = {
  name: "Type",
  className: "w-[200px]",
  render(data) {
    return <div className="text-textPrimary">{data?.proxyType}</div>;
  },
};

export function useDelayBlockOrTimeColumn() {
  const [isBlock, setIsBlock] = useState(true);

  return {
    name: (
      <button
        className="text-theme500"
        onClick={() => {
          setIsBlock(!isBlock);
        }}
      >
        {isBlock ? "Delay Blocks" : "Delay time"}
      </button>
    ),
    className: "w-[200px]",
    render(data) {
      const { delay } = data;

      if (delay === 0) {
        return <div className="text-textPrimary">-</div>;
      }

      return (
        <div className="text-textPrimary">
          {isBlock ? delay : formatTimeDuration(delay)}
        </div>
      );
    },
  };
}
