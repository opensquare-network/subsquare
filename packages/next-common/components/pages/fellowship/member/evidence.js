import { IpfsEvidenceContent } from "next-common/components/collectives/core/evidenceContent";
import EvidenceLayout from "next-common/components/layout/evidenceLayout";
import { usePageProps } from "next-common/context/page";
import { WishBar } from "./fellowshipMember/wishBar";
import { MarkdownPreviewer } from "@osn/previewer";
import ContentWithComment from "next-common/components/detail/common/contentWithComment";
import { PostProvider } from "next-common/context/post";
import ArticleActions from "next-common/components/actions/articleActions";
import PostMetaBase from "next-common/components/detail/container/postMeta/metaBase";
import { CommentsContent } from "next-common/components/detail/container/postMeta/comments";
import Divider from "next-common/components/styled/layout/divider";
import { SimpleTime } from "next-common/components/postList/common/postItemTime";
import { CreateReferendumAndVote } from "./fellowshipMember/wishDetail";
import CollectivesProvider from "next-common/context/collectives/collectives";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import CollectivesMembersProvider from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/collectivesMember";
import { ActiveReferendaProvider } from "next-common/context/activeReferenda";
import { FellowshipReferendumTitleImpl } from "next-common/components/fellowshipReferendumTitle";
import MyVote from "./fellowshipMember/myVote";
import { ReferendumVoteButtons } from "./fellowshipMember/voteButtons";

export default function EvidencePage(props) {
  return (
    <PostProvider post={props.detail}>
      <ActiveReferendaProvider pallet="fellowshipReferenda">
        <CollectivesProvider>
          <CollectivesMembersProvider>
            <EvidenceLayout
              seoInfo={{
                title: props.detail?.title,
                desc: props.detail?.title,
              }}
            >
              <ContentWithComment>
                <EvidencePageImpl />
              </ContentWithComment>
            </EvidenceLayout>
          </CollectivesMembersProvider>
        </CollectivesProvider>
      </ActiveReferendaProvider>
    </PostProvider>
  );
}

function EvidencePageImpl() {
  const { detail, comments } = usePageProps() || {};

  if (!detail) {
    return null;
  }

  return (
    <div className="flex flex-col gap-y-6">
      <WishBar wish={detail.wish} rank={detail.rank} address={detail.who} />
      <PostMetaBase>
        <SimpleTime timestamp={detail.indexer?.blockTime} />
        <CommentsContent commentsCount={comments?.total || 0} />
      </PostMetaBase>
      <Divider />
      <div>
        <EvidenceContent />
        <ArticleActions editable={false} />
        <RelatedReferenda />
      </div>
    </div>
  );
}

function ReferendumVoteItem({ referendumIndex }) {
  return (
    <div className="flex items-center justify-between text14Medium max-sm:flex-col max-sm:gap-y-3">
      <div className="flex flex-col gap-[4px]">
        <FellowshipReferendumTitleImpl referendumIndex={referendumIndex} />
        <MyVote referendumIndex={referendumIndex} />
      </div>
      <ReferendumVoteButtons referendumIndex={referendumIndex} />
    </div>
  );
}

function RelatedReferenda() {
  const { detail } = usePageProps() || {};

  const { referenda = [] } = detail || {};

  if (!referenda.length) {
    return null;
  }

  let content;

  if (referenda.length <= 0) {
    content = (
      <div className="flex gap-x-[16px] justify-between items-center max-sm:flex-col max-sm:gap-y-3">
        <p className="text-textTertiary text14Medium">
          No referendum was created
        </p>
        <CreateReferendumAndVote who={detail.who} wish={detail.wish} />
      </div>
    );
  } else {
    content = (
      <div className="flex flex-col gap-[16px]">
        {referenda.map((referendum, index) => (
          <ReferendumVoteItem key={index} referendumIndex={referendum.index} />
        ))}
      </div>
    );
  }

  return <SecondaryCard className="mt-4 !p-4">{content}</SecondaryCard>;
}

function EvidenceContent() {
  const { detail } = usePageProps() || {};

  if (detail.content) {
    return <MarkdownPreviewer content={detail.content} />;
  } else if (detail.cid) {
    return <IpfsEvidenceContent cid={detail.cid} />;
  }

  return null;
}
