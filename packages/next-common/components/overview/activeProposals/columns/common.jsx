import ListPostTitle from "next-common/components/postList/postTitle";
import PostListCardVotesSummaryBar from "next-common/components/postList/votesSummaryBar";
import Flex from "next-common/components/styled/flex";
import Tag from "next-common/components/tags/state/tag";

export function getReferendumPostTitleColumn() {
  return {
    name: "Referendum",
    className: "text-left",
    cellRender(data) {
      return (
        <ListPostTitle
          className="line-clamp-1"
          data={data}
          href={data.detailLink}
        />
      );
    },
  };
}
export function getProposalPostTitleColumn() {
  return {
    ...getReferendumPostTitleColumn(),
    name: "Proposal",
  };
}

export function getVoteSummaryColumn(props) {
  return {
    name: "",
    className: "w-6",
    cellRender(data) {
      const hasTally = data.onchainData?.tally || data.onchainData?.info?.tally;
      return (
        hasTally && (
          <Flex>
            <PostListCardVotesSummaryBar data={data} {...props} />
          </Flex>
        )
      );
    },
  };
}

export function getStatusTagColumn(props) {
  return {
    name: "Status",
    className: "text-right w-[120px]",
    cellRender(data) {
      return data.status && <Tag state={data.status} data={data} {...props} />;
    },
  };
}
