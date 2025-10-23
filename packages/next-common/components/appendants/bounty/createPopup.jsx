import { treasuryBountiesAppendantApi } from "next-common/services/url";
import { useBountyAppendantsContext } from "next-common/context/bountyAppendants";
import { usePageProps } from "next-common/context/page";
import CreateAppendantPopup from "../common/createPopup";

export default function BountyCreateAppendantPopup({ setIsAppend }) {
  const { update } = useBountyAppendantsContext();
  const { id } = usePageProps();
  const createApi = treasuryBountiesAppendantApi(id);

  return (
    <CreateAppendantPopup
      onClose={() => setIsAppend(false)}
      createApi={createApi}
      onSuccess={update}
      description="You are adding an appendant as proposer/curator."
    />
  );
}
