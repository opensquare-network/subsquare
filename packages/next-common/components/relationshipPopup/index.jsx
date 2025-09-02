import { noop } from "@polkadot/util";
import { cn } from "next-common/utils";
import Popup from "../popup/wrapper/Popup";
import AddressProvider from "next-common/context/address";
import RelationshipContent from "./relationshipContent";
import ViewTypeSelect from "./viewTypeSelect";
import RelationshipViewTypeProvider, {
  useRelationshipViewTypeState,
} from "next-common/context/relationship/selectViewType";

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
        title={<SelectViewTypeWithTitle title={title} />}
        onClose={onClose}
      >
        <AddressProvider address={sourceAddress}>
          <RelationshipContent />
        </AddressProvider>
      </Popup>
    </RelationshipViewTypeProvider>
  );
}

function SelectViewTypeWithTitle({ title }) {
  const { setViewType } = useRelationshipViewTypeState();
  return (
    <div className="flex items-center gap-2">
      {title}
      <ViewTypeSelect setViewType={setViewType} />
    </div>
  );
}
