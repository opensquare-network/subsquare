import VestingExplorerTable from "./table";
import PageHeader from "../common/pageHeader";

export default function VestingExplorer() {
  return (
    <>
      <PageHeader href="https://wiki.polkadot.network/docs/learn-transactions#vested-transfers" />
      <VestingExplorerTable />
    </>
  );
}
