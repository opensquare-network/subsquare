import PageHeader from "../common/pageHeader";
import MultisigExplorerTable from "./table";
import { CallPopupProvider } from "next-common/components/multisigs/context/callPopupContext";

export default function MultisigExplorer() {
  return (
    <>
      <PageHeader href="https://wiki.polkadot.network/docs/learn-account-multisig" />
      <CallPopupProvider>
        <MultisigExplorerTable />
      </CallPopupProvider>
    </>
  );
}
