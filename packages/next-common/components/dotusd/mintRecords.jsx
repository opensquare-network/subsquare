import DotUsdLayout, { Section } from "./layout";
import DotUsdSwapRecords from "./records";
import { SWAP_METHOD } from "./records/swapRecords";

export default function DotUsdMintRecords() {
  return (
    <DotUsdLayout>
      <Section
        title="Mint records"
        hint="dotUSD minted through the PSM against an approved external asset"
      >
        <DotUsdSwapRecords
          method={SWAP_METHOD.mint}
          noDataText="No dotUSD minted yet"
        />
      </Section>
    </DotUsdLayout>
  );
}
