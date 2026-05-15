import BigNumber from "bignumber.js";
import Tooltip from "next-common/components/tooltip";

export function useStakingNominationsMyShareColumn() {
  return {
    name: "My Share",
    style: { textAlign: "right", width: "120px", minWidth: "120px" },
    render: (item) => {
      if (
        BigNumber(item.nominator_stake).lte(0) ||
        BigNumber(item.total_stake).lte(0)
      ) {
        return (
          <span key="myShare" className="text-textTertiary">
            -
          </span>
        );
      }

      const myShare = BigNumber(item.nominator_stake)
        .div(item.total_stake)
        .times(100);

      return (
        <Tooltip key="myShare" content={`${myShare}%`}>
          <span className="text14Medium text-textPrimary">
            {myShare.toFixed(2)}%
          </span>
        </Tooltip>
      );
    },
  };
}
