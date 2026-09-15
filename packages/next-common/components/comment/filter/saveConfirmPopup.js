import { noop } from "lodash-es";
import Popup from "next-common/components/popup/wrapper/Popup";
import { PopupButtonWrapper } from "next-common/components/popup/wrapper";
import PrimaryButton from "next-common/lib/button/primary";
import SecondaryButton from "next-common/lib/button/secondary";

export default function SaveCommentFilterConfirmPopup({
  setShow = noop,
  onConfirm = noop,
  isLoading = false,
}) {
  return (
    <Popup
      title="Save as default comment filter"
      onClose={() => setShow(false)}
    >
      <div className="text-[14px] text-textPrimary">
        The current comment filter settings will be saved as the default for all
        visitors of this proposal.
      </div>
      <PopupButtonWrapper className="gap-[8px]">
        <SecondaryButton onClick={() => setShow(false)}>Cancel</SecondaryButton>
        <PrimaryButton loading={isLoading} onClick={onConfirm}>
          Save
        </PrimaryButton>
      </PopupButtonWrapper>
    </Popup>
  );
}
