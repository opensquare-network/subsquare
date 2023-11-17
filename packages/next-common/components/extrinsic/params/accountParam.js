import AddressParam from "./addressParam";
import EnumParam from "./enumParam";

export default function AccountParam({ def, value, setValue }) {
  // special handling for MultiAddress
  if (def.type === "MultiAddress") {
    return <EnumParam def={def} value={value} setValue={setValue} />;
  }

  return <AddressParam value={value ?? ""} setValue={setValue} />;
}
