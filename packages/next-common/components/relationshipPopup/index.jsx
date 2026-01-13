import { noop } from "@polkadot/util";
import { cn } from "next-common/utils";
import Popup from "../popup/wrapper/Popup";
import AddressProvider from "next-common/context/address";
import RelationshipContent from "./relationshipContent";
import RelationshipViewTypeProvider from "next-common/context/relationship/selectViewType";

export default function RelationshipPopup({
  title = "Relatives",
  className = "",
  onClose = noop,
  sourceAddress = "",
}) {
  if (!sourceAddress) {
    return null;
  }
  return (
    <RelationshipViewTypeProvider>
      <Popup
        className={cn("w-[960px]", className)}
        title={title}
        onClose={onClose}
      >
        <AddressProvider address={sourceAddress}>
          <RelationshipContent />
        </AddressProvider>
      </Popup>
    </RelationshipViewTypeProvider>
  );
}
