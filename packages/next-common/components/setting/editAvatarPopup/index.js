import PopupWithSigner from "next-common/components/popupWithSigner";

function Content() {
  return null;
}

export default function EditAvatarPopup(props) {
  return (
    <PopupWithSigner title="Edit Avatar" {...props}>
      <Content />
    </PopupWithSigner>
  );
}
