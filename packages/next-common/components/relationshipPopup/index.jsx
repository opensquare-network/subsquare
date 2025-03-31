import { noop } from "@polkadot/util";
import { cn } from "next-common/utils";
import Popup from "../popup/wrapper/Popup";
import Indications from "./indications";
import Relationship from "./relationship";

export default function RelationshipPopup({
  title = "Relatives",
  className = "",
  onClose = noop,
}) {
  return (
    <Popup
      className={cn("w-[960px]", className)}
      title={title}
      onClose={onClose}
    >
      <Relationship />
      <Indications />
    </Popup>
  );
}
