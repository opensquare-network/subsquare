import { gov2ReferendaAppendantApi } from "next-common/services/url";
import { useReferendaAppendantsContext } from "next-common/context/referendaAppendants";
import { usePageProps } from "next-common/context/page";
import CreateAppendantPopup from "../common/createPopup";

export default function LegacyCreateAppendantPopup({ setIsAppend }) {
  const { update } = useReferendaAppendantsContext();
  const { id } = usePageProps();

  return (
    <CreateAppendantPopup
      onClose={() => setIsAppend(false)}
      createApi={gov2ReferendaAppendantApi(id)}
      onSuccess={update}
      description="You are adding an appendant as authors."
    />
  );
}
