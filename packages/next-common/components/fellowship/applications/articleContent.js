import { useState } from "react";
import styled from "styled-components";
import ArticleActions from "next-common/components/actions/articleActions";
import Divider from "next-common/components//styled/layout/divider";
import NonEdited from "next-common/components//detail/common/NonEdited";
import PostContent from "next-common/components//detail/common/PostContent";
import { usePost } from "next-common/context/post";
import { isPostEdited } from "next-common/utils/post";
import Tabs from "next-common/components/tabs";
import ContentSummary from "next-common/components//contentSummary";
import PostDataSource from "next-common/components//postDataSource";

const Wrapper = styled.div`
  :hover {
    .edit {
      display: block;
    }
  }
`;

export default function ArticleContent({ setIsEdit, className = "" }) {
  const post = usePost();

  const postContent = (
    <>
      <PostContent post={post} />
      {isPostEdited(post) && (
        <div className="mt-4 text12Medium text-textTertiary">Edited</div>
      )}
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

      <ArticleActions setIsEdit={setIsEdit} extraActions={<PostDataSource />} />
    </Wrapper>
  );
}
