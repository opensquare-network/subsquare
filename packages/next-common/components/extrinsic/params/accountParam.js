import AddressParam from "./addressParam";
import EnumParam from "./enumParam";

export default function AccountParam({ title, def, value, setValue }) {
  // special handling for MultiAddress
  if (def.type === "MultiAddress") {
    return (
      <EnumParam title={title} def={def} value={value} setValue={setValue} />
    );
  }

  return <AddressParam title={title} value={value ?? ""} setValue={setValue} />;
}
