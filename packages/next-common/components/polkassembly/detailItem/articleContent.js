import styled from "styled-components";
import PolkassemblyActions from "next-common/components/polkassembly/actions";
import { MarkdownPreviewer } from "@osn/previewer";
import NoData from "next-common/components/noData";
import { usePost } from "next-common/context/post";
import ContentSummary from "next-common/components/contentSummary";
import { useState } from "react";
import Tabs from "next-common/components/tabs";
import Divider from "next-common/components/styled/layout/divider";
import PostDataSource from "next-common/components/postDataSource";

const EditedLabel = styled.div`
  margin-top: 8px;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  color: var(--textTertiary);
`;

export default function ArticleContent({ postReactions, className = "" }) {
  const post = usePost();

  const postContent = (
    <>
      <MarkdownPreviewer
        content={post.content || ""}
        markedOptions={{
          breaks: true,
        }}
      />

      {post.createdAt !== post.updatedAt && <EditedLabel>Edited</EditedLabel>}
    </>
  );

  const tabs = [
    {
      value: "content",
      label: "Content",
      content: postContent,
    },
    post.contentSummary?.summary && {
      value: "ai_summary",
      label: "AI Summary",
      content: <ContentSummary />,
    },
  ].filter(Boolean);
  const [activeValue, setActiveValue] = useState(tabs[0].value);

  if (!post) {
    return null;
  }

  return (
    <div className={className}>
      {post.content === "" && (
        <NoData text={"The post has not been edited by creator."} />
      )}

      {post.content && (
        <div className="mt-6">
          {post.contentSummary?.summary ? (
            <Tabs
              activeTabValue={activeValue}
              tabs={tabs}
              onTabClick={(tab) => {
                setActiveValue(tab.value);
              }}
            />
          ) : (
            <>
              <Divider className="mb-4" />
              {postContent}
            </>
          )}
        </div>
      )}

      <PolkassemblyActions
        reactions={postReactions}
        extraActions={<PostDataSource />}
      />
    </div>
  );
}
