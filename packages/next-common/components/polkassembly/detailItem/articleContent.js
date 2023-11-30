import styled from "styled-components";
import PolkassemblyActions from "next-common/components/polkassembly/actions";
import PostDataSource from "next-common/components/postDataSource";
import { MarkdownPreviewer } from "@osn/previewer";
import RichTextStyleWrapper from "next-common/components/content/richTextStyleWrapper";
import NoData from "next-common/components/noData";
import { usePost } from "next-common/context/post";
import ContentSummary from "next-common/components/contentSummary";
import { useState } from "react";
import Tabs from "next-common/components/tabs";
import Divider from "next-common/components/styled/layout/divider";

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
      <RichTextStyleWrapper>
        <MarkdownPreviewer content={post.content || ""} />
      </RichTextStyleWrapper>

      {post.createdAt !== post.updatedAt && <EditedLabel>Edited</EditedLabel>}
    </>
  );

  const tabs = [
    {
      label: "Content",
      content: postContent,
    },
    post.contentSummary?.summary && {
      label: "AI Summary",
      tooltip: "Powered by OpenAI",
      content: (
        <RichTextStyleWrapper>
          <ContentSummary />
        </RichTextStyleWrapper>
      ),
    },
  ].filter(Boolean);
  const [activeTab, setActiveTab] = useState(tabs[0].label);

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
              activeTabLabel={activeTab}
              tabs={tabs}
              onTabClick={(tab) => {
                setActiveTab(tab.label);
              }}
            />
          ) : (
            <>
              <Divider />
              {postContent}
            </>
          )}
        </div>
      )}

      <PostDataSource />
      <PolkassemblyActions reactions={postReactions} />
    </div>
  );
}
