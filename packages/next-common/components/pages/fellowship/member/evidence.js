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

export default function EvidencePage(props) {
  return (
    <PostProvider post={props.detail}>
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
      </div>
    </div>
  );
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
