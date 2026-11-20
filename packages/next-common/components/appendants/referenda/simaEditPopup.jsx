import { useReferendaAppendantsContext } from "next-common/context/referendaAppendants";
import { usePost } from "next-common/context/post";
import { useUser } from "next-common/context/user";
import { isSameAddress } from "next-common/utils";
import { useReplaceReferendaAppendant } from "next-common/sima/actions/appendant";
import { getRealField } from "next-common/sima/actions/common";
import AppendantFormPopup from "../common/appendantFormPopup";
import { UpdateButton } from "../common/submitButton";

export default function SimaEditAppendantPopup({ onClose, editData }) {
  const { update } = useReferendaAppendantsContext();
  const post = usePost();
  const user = useUser();
  const replaceReferendaAppendant = useReplaceReferendaAppendant();
  const realAddress =
    user?.proxyAddress && isSameAddress(user.proxyAddress, editData?.proposer)
      ? user.proxyAddress
      : undefined;

  const submit = (content, contentType) =>
    replaceReferendaAppendant(
      post,
      editData,
      content,
      contentType,
      getRealField(realAddress),
    );

  return (
    <AppendantFormPopup
      title="Edit Appendant"
      description="You are editing an appendant as authors."
      onClose={onClose}
      onSuccess={update}
      submit={submit}
      successMessage="Appendant updated successfully"
      initialContent={editData?.content || ""}
      initialContentType={editData?.contentType || "markdown"}
      SubmitButton={UpdateButton}
    />
  );
}
