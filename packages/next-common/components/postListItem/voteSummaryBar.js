import Flex from "next-common/components/styled/flex";
import businessCategory from "next-common/utils/consts/business/category";
import PostListCardVotesSummaryBar from "../postList/votesSummaryBar";

export default function VoteSummaryBar({ data, type }) {
  if (!data) {
    return;
  }

  const hasTally = data.onchainData?.tally || data.onchainData?.info?.tally;
  const showTally = [
    businessCategory.democracyReferenda,
    businessCategory.openGovReferenda,
    businessCategory.fellowship,
  ].includes(type);

  if (!showTally || !hasTally) {
    return null;
  }

  return (
    <Flex>
      <PostListCardVotesSummaryBar data={data} type={type} />
    </Flex>
  );
}
