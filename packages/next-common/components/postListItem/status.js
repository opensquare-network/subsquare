import { getMotionStateArgs } from "next-common/utils/collective/result";
import { isDemocracyCollective, isGov2Referendum } from "./utils";
import { getGov2ReferendumStateArgs } from "next-common/utils/gov2/result";
import { getDemocracyStateArgs } from "next-common/utils/democracy/result";
import businessCategory from "next-common/utils/consts/business/category";
import Tag from "next-common/components/tags/state/tag";

export default function Status({ data, type }) {
  if (!data) {
    return;
  }

  if (!data.status) {
    return;
  }

  let stateArgs;
  if (isDemocracyCollective(type)) {
    stateArgs = getMotionStateArgs(data.onchainData.state);
  } else if (isGov2Referendum(type)) {
    stateArgs = getGov2ReferendumStateArgs(data.onchainData?.state);
  } else if (businessCategory.democracyReferenda === type) {
    stateArgs = getDemocracyStateArgs(
      data.onchainData.state,
      data.onchainData.timeline,
    );
  }

  return (
    <Tag state={data.status} category={type} args={stateArgs} data={data} />
  );
}
