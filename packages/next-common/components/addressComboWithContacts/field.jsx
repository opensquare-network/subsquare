import PopupLabel from "next-common/components/popup/label";
import AddressComboWithContacts from ".";

export default function AddressComboWithContactsField({
  title = "To",
  address,
  setAddress,
  readOnly = false,
}) {
  return (
    <div>
      <PopupLabel text={title} />
      <AddressComboWithContacts
        address={address}
        setAddress={setAddress}
        readOnly={readOnly}
      />
    </div>
  );
}
