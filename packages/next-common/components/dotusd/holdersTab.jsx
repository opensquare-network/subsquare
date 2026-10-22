import { Section } from "./layout";
import DotUsdHolders from "./holders";

export default function DotUsdHoldersTab() {
  return (
    <Section title="Holders" hint="dotUSD holders ordered by balance">
      <DotUsdHolders />
    </Section>
  );
}
