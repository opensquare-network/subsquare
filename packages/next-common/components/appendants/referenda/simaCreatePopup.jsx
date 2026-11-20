import { useReferendaAppendantsContext } from "next-common/context/referendaAppendants";
import { usePost } from "next-common/context/post";
import { useIsPostAuthor } from "next-common/context/post/useIsPostAuthor";
import usePostProxyAuthor from "next-common/hooks/usePostProxyAuthor";
import { useAddReferendaAppendant } from "next-common/sima/actions/appendant";
import { getRealField } from "next-common/sima/actions/common";
import AppendantFormPopup from "../common/appendantFormPopup";

export default function SimaCreateAppendantPopup({ setIsAppend }) {
  const { update } = useReferendaAppendantsContext();
  const post = usePost();
  const isAuthor = useIsPostAuthor();
  const proxyAddress = usePostProxyAuthor();
  const addReferendaAppendant = useAddReferendaAppendant();
  const realAddress = !isAuthor && proxyAddress ? proxyAddress : undefined;

  const submit = (content, contentType) =>
    addReferendaAppendant(
      post,
      content,
      contentType,
      getRealField(realAddress),
    );

  return (
    <AppendantFormPopup
      title="Create Appendant"
      description="You are adding an appendant as authors."
      onClose={() => setIsAppend(false)}
      onSuccess={update}
      submit={submit}
      successMessage="Appendant created successfully"
    />
  );
}
