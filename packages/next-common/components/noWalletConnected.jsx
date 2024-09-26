import { SystemWalletDisconnected } from "@osn/icons/subsquare";
import NoData from "./noData";
import { useLoginPopup } from "next-common/hooks/useLoginPopup";
import PrimaryButton from "next-common/lib/button/primary";

export default function NoWalletConnected({
  head = "No wallet connected",
  text = "",
  className = "",
  ...props
}) {
  const { openLoginPopup } = useLoginPopup();

  return (
    <NoData
      {...props}
      className={className}
      head={head}
      text={text}
      icon={
        <SystemWalletDisconnected className="w-10 h-10 text-textTertiary" />
      }
    >
      <div className="flex justify-center mt-6">
        <PrimaryButton onClick={openLoginPopup}>Connect Wallet</PrimaryButton>
      </div>
    </NoData>
  );
}
