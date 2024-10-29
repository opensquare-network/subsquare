import { useState } from "react";
import styled from "styled-components";
import ArticleActions from "./actions/articleActions";
import Poll from "./poll";
import Divider from "./styled/layout/divider";
import NonEdited from "./detail/common/NonEdited";
import PostContent from "./detail/common/PostContent";
import { usePost } from "../context/post";
import { getBannerUrl } from "../utils/banner";
import { isPostEdited } from "next-common/utils/post";
import Tabs from "./tabs";
import ContentSummary from "./contentSummary";
import PostDataSource from "./postDataSource";

const Wrapper = styled.div`
  :hover {
    .edit {
      display: block;
    }
  }
`;

const BannerImage = styled.img`
  width: 100%;
  margin-bottom: 1rem;
`;

export default function ArticleContent({ setIsEdit, className = "" }) {
  const post = usePost();
  const bannerUrl = getBannerUrl(post.bannerCid);

  const postContent = (
    <>
      {bannerUrl && <BannerImage src={bannerUrl} alt="banner image" />}

      <PostContent post={post} />

      {isPostEdited(post) && (
        <div className="mt-4 text12Medium text-textTertiary">Edited</div>
      )}
    </>
  );

  const tabs = [
    {
      label: "Content",
      content: postContent,
    },
    post.contentSummary?.summary && {
      label: "AI Summary",
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
              {postContent}
            </>
          )}
        </div>
      )}

      {post.poll && (
        <>
          <Divider margin={16} />
          <Poll />
        </>
      )}

      <ArticleActions setIsEdit={setIsEdit} extraActions={<PostDataSource />} />
    </Wrapper>
  );
}
