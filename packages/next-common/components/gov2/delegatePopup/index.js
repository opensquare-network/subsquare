import PopupWithSigner from "next-common/components/popupWithSigner";
import PopupContent from "./popupContent";
import { TransactionProvider } from "./context/tx";

export default function DelegatePopup({
  defaultTargetAddress,
  targetDisabled,
  ...props
}) {
  return (
    <PopupWithSigner title="Delegate" className="!w-[640px]" {...props}>
      <TransactionProvider>
        <PopupContent
          defaultTargetAddress={defaultTargetAddress}
          targetDisabled={targetDisabled}
        />
      </TransactionProvider>
    </PopupWithSigner>
  );
}
