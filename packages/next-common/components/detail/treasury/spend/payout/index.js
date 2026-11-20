import { RightBarWrapper } from "next-common/components/layout/sidebar/rightBarWrapper";
import { useOnchainData } from "next-common/context/post";
import Meta from "next-common/components/detail/treasury/spend/payout/meta";
import TreasurySpendPay from "next-common/components/detail/treasury/spend/payout/pay";
import PayHint from "next-common/components/detail/treasury/spend/payout/paidInfo";
import useSpendPayoutAction from "next-common/components/detail/treasury/spend/payout/useSpendPayoutAction";

export default function TreasurySpendPayout() {
  const { index } = useOnchainData() || {};
  // One chain subscription decides both the action and the paid hint
  const payout = useSpendPayoutAction(index);

  return (
    <RightBarWrapper>
      <Meta />
      <TreasurySpendPay payout={payout} />
      <PayHint payout={payout} />
    </RightBarWrapper>
  );
}
