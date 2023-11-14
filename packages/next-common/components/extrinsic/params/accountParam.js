import AddressParam from "./addressParam";
import EnumParam from "./enumParam";

export default function AccountParam({ def }) {
  // special handling for MultiAddress
  if (def.type === "MultiAddress") {
    return <EnumParam def={def} />;
  }

  return <AddressParam />;
}
