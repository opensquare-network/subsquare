import styled from "styled-components";
import PolkassemblyActions from "next-common/components/polkassembly/actions";
import PostDataSource from "next-common/components/postDataSource";
import { MarkdownPreviewer } from "@osn/previewer";
import RichTextStyleWrapper from "next-common/components/content/richTextStyleWrapper";
import NoData from "next-common/components/noData";
import { usePost } from "next-common/context/post";
import AISummaryContent from "next-common/components/aiSummaryContent";
import { useState } from "react";
import Tabs from "next-common/components/tabs";

const EditedLabel = styled.div`
  margin-top: 8px;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  color: var(--textTertiary);
`;

export default function ArticleContent({ postReactions, className = "" }) {
  const post = usePost();

  if (!post) {
    return null;
  }

  const tabs = [
    {
      label: "Content",
      content: (
        <RichTextStyleWrapper>
          <MarkdownPreviewer content={post.content} />
        </RichTextStyleWrapper>
      ),
    },
    post.aiSummaryContent && {
      label: "AI Summary",
      tooltip: "Powered by OpenAI",
      content: (
        <RichTextStyleWrapper>
          <AISummaryContent />
        </RichTextStyleWrapper>
      ),
    },
  ].filter(Boolean);
  const [activeTab, setActiveTab] = useState(tabs[0].label);

  return (
    <div className={className}>
      {post.content === "" && (
        <NoData text={"The post has not been edited by creator."} />
      )}

      {post.content && (
        <div className="mt-6">
          <Tabs
            activeTabLabel={activeTab}
            tabs={tabs}
            onTabClick={(tab) => {
              setActiveTab(tab.label);
            }}
          />
        </div>
      )}

      <MarkdownPreviewer content={post.content} />
      {post.createdAt !== post.updatedAt && <EditedLabel>Edited</EditedLabel>}
      <PostDataSource />
      <PolkassemblyActions reactions={postReactions} />
    </div>
  );
}
