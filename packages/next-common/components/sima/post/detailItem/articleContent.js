import { useState } from "react";
import styled from "styled-components";
import ArticleActions from "./articleActions";
import Divider from "next-common/components/styled/layout/divider";
import NonEdited from "next-common/components/detail/common/NonEdited";
import PostContent from "next-common/components/detail/common/PostContent";
import { usePost } from "next-common/context/post";
import Tabs from "next-common/components/tabs";
import ContentSummary from "next-common/components/contentSummary";
import PostDataSource from "next-common/components/postDataSource";

const Wrapper = styled.div`
  :hover {
    .edit {
      display: block;
    }
  }
`;

export default function ArticleContent({ setIsEdit, className = "" }) {
  const post = usePost();

  const tabs = [
    {
      label: "Content",
      content: <PostContent post={post} />,
    },
    post.contentSummary?.summary && {
      label: "AI Summary",
      tooltip: "Powered by OpenAI",
      content: <ContentSummary />,
    },
  ].filter(Boolean);
  const [activeTab, setActiveTab] = useState(tabs[0].label);

  return (
    <Wrapper className={className}>
      {!post.content && (
        <>
          <Divider className="mb-4" />
          <NonEdited setIsEdit={setIsEdit} />
        </>
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
              <Divider className="mb-4" />
              <PostContent post={post} />
            </>
          )}
        </div>
      )}

      <ArticleActions setIsEdit={setIsEdit} extraActions={<PostDataSource />} />
    </Wrapper>
  );
}
