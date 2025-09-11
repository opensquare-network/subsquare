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
import Poll from "next-common/components/poll";

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
      value: "content",
      label: "Content",
      content: <PostContent post={post} />,
    },
    post.contentSummary?.summary && {
      value: "ai_summary",
      label: "AI Summary",
      content: <ContentSummary />,
    },
  ].filter(Boolean);

  const [activeValue, setActiveValue] = useState(tabs[0].value);

  return (
    <Tabs
      activeTabValue={activeValue}
      tabs={tabs}
      onTabClick={(tab) => {
        setActiveValue(tab.value);
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

      {post.poll && (
        <>
          <Divider margin={16} />
          <Poll />
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
