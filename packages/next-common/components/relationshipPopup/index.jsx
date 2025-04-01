import { noop } from "@polkadot/util";
import { cn } from "next-common/utils";
import useConversionRelationshipNode from "next-common/hooks/useConversionRelationshipNode";
import Popup from "../popup/wrapper/Popup";
import Indications from "./indications";
import Relationship from "./relationship";

export default function RelationshipPopup({
  title = "Relatives",
  className = "",
  onClose = noop,
  signatoryList = [],
  proxiedList = [],
  receivedList = [],
}) {
  const { nodes, edges } = useConversionRelationshipNode({
    signatoryList,
    proxiedList,
    receivedList,
  });

  return (
    <Popup
      className={cn("w-[960px]", className)}
      title={title}
      onClose={onClose}
    >
      <Relationship nodes={nodes} edges={edges} />
      <Indications />
    </Popup>
  );
}
