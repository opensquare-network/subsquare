import { gov2ReferendaAppendantApi } from "next-common/services/url";
import { useReferendaAppendantsContext } from "next-common/context/referendaAppendants";
import { usePageProps } from "next-common/context/page";
import CreateAppendantPopup from "../common/createPopup";

export default function ReferendaCreateAppendantPopup({ setIsAppend }) {
  const { update } = useReferendaAppendantsContext();
  const { id } = usePageProps();
  const createApi = gov2ReferendaAppendantApi(id);

  return (
    <CreateAppendantPopup
      onClose={() => setIsAppend(false)}
      createApi={createApi}
      onSuccess={update}
      description="You are adding an appendant as authors."
    />
  );
}
