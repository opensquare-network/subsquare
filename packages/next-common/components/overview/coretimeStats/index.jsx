// import { SystemClose } from "@osn/icons/subsquare";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import { useChainSettings } from "next-common/context/chain";

export default function CoretimeStats() {
  const { modules } = useChainSettings();

  if (!modules?.coretime) {
    return null;
  }

  return (
    <GreyPanel className="text-textTertiary text14Medium py-2.5 px-4 justify-between">
      Coretime:
      {/* <SystemClose className="w-5 h-5" role="button" onClick={close} /> */}
    </GreyPanel>
  );
}
