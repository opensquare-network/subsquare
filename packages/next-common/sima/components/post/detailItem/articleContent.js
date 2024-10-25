import { useState } from "react";
import styled from "styled-components";
import ArticleActions from "./articleActions";
import Divider from "next-common/components/styled/layout/divider";
import PostContent from "next-common/components/detail/common/PostContent";
import { usePost } from "next-common/context/post";
import Tabs from "next-common/components/tabs";
import ContentSummary from "next-common/components/contentSummary";
import PostDataSource from "next-common/components/postDataSource";
import Appendant from "./appendant";
import NonEdited from "next-common/components/detail/common/NonEdited";
import { noop } from "lodash-es";

const Wrapper = styled.div`
  :hover {
    .edit {
      display: block;
    }
  }
`;

function PostContentTab() {
  const post = usePost();

  const tabs = [
    {
      label: "Content",
      content: <PostContent post={post} />,
    },
    post.contentSummary?.summary && {
      label: "AI Summary",
      content: <ContentSummary />,
    },
  ].filter(Boolean);

  const [activeTab, setActiveTab] = useState(tabs[0].label);

  return (
    <Tabs
      activeTabLabel={activeTab}
      tabs={tabs}
      onTabClick={(tab) => {
        setActiveTab(tab.label);
      }}
    />
  );
}

export default function ArticleContent({ className = "", setIsEdit = noop }) {
  const post = usePost();
  const [isAppend, setIsAppend] = useState(false);

  return (
    <Wrapper className={className}>
      {post.content ? (
        <div className="mt-6">
          {post.contentSummary?.summary ? (
            <PostContentTab />
          ) : (
            <>
              <Divider className="mb-4" />
              <PostContent post={post} />
            </>
          )}
        </div>
      ) : (
        <>
          <Divider className="mb-4" />
          <NonEdited setIsEdit={setIsEdit} />
        </>
      )}

      <Appendant isAppend={isAppend} setIsAppend={setIsAppend} />
      {!isAppend && (
        <ArticleActions
          setIsEdit={setIsEdit}
          setIsAppend={setIsAppend}
          extraActions={<PostDataSource />}
        />
      )}
    </Wrapper>
  );
}
