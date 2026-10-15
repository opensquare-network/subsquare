import DotUsdLayout, { Section } from "./layout";
import DotUsdSwapRecords from "./records";
import { SWAP_METHOD } from "./records/swapRecords";

export default function DotUsdRedeemRecords() {
  return (
    <DotUsdLayout withPsmState={false}>
      <Section
        title="Redeem records"
        hint="dotUSD redeemed through the PSM for an approved external asset"
      >
        <DotUsdSwapRecords
          method={SWAP_METHOD.redeem}
          noDataText="No dotUSD redeemed yet"
        />
      </Section>
    </DotUsdLayout>
  );
}
