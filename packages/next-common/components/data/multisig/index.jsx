import PageHeader from "../common/pageHeader";
import MultisigExplorerTable from "./table";

export default function MultisigExplorer() {
  return (
    <>
      <PageHeader href="https://wiki.polkadot.network/docs/learn-account-multisig" />
      <MultisigExplorerTable />
    </>
  );
}
