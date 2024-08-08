import { RightBarWrapper } from "next-common/components/layout/sidebar/rightBarWrapper";
import Meta from "next-common/components/detail/treasury/spend/payout/meta";
import TreasurySpendPay from "next-common/components/detail/treasury/spend/payout/pay";

export default function TreasurySpendPayout() {
  return (
    <RightBarWrapper>
      <Meta />
      <TreasurySpendPay />
    </RightBarWrapper>
  );
}
