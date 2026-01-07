import VestingExplorerTable from "./table";
import { PageHeaderTitle } from "../common/pageHeader";

export default function VestingExplorer() {
  return (
    <>
      <PageHeaderTitle
        title="Vesting Explorer"
        href="https://wiki.polkadot.network/docs/learn-transactions#vested-transfers"
      />
      <VestingExplorerTable />
    </>
  );
}
