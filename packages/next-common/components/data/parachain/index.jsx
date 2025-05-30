import PageHeader from "../common/pageHeader";
import ParachainExplorerTable from "./table";
import { CallPopupProvider } from "next-common/components/multisigs/context/callPopupContext";

export default function ParachainExplorer() {
  return (
    <>
      <PageHeader href="https://wiki.polkadot.network/docs/learn-parachains-index" />
      <CallPopupProvider>
        <ParachainExplorerTable />
      </CallPopupProvider>
    </>
  );
}
