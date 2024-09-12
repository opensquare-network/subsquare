import { RightBarWrapper } from "next-common/components/layout/sidebar/rightBarWrapper";
import Meta from "next-common/components/detail/treasury/spend/payout/meta";
import TreasurySpendPay from "next-common/components/detail/treasury/spend/payout/pay";
import PayHint from "next-common/components/detail/treasury/spend/payout/paidInfo";

export default function TreasurySpendPayout() {
  return (
    <RightBarWrapper>
      <Meta />
      <TreasurySpendPay />
      <PayHint />
    </RightBarWrapper>
  );
}
