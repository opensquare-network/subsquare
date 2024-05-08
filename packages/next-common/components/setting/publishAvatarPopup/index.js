import CheckSimaSpec from "next-common/components/checkSimaSpec";
import PopupWithSigner from "next-common/components/popupWithSigner";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import PrimaryButton from "next-common/lib/button/primary";

function Content() {
  const { onClose } = usePopupParams();
  return (
    <>
      <CheckSimaSpec />
      <div className="flex justify-end">
        <PrimaryButton onClick={onClose}>Confirm</PrimaryButton>
      </div>
    </>
  );
}

export default function PublishAvatarPopup(props) {
  return (
    <PopupWithSigner title="Save & Publish" wide {...props}>
      <Content />
    </PopupWithSigner>
  );
}
