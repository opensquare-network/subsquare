import VestingExplorerTable from "./table";
import CommonHeader from "../common/header";

export default function VestingExplorer() {
  return (
    <>
      <CommonHeader href="https://wiki.polkadot.network/docs/learn-transactions#vested-transfers" />
      <VestingExplorerTable />
    </>
  );
}
