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
import PostContentTranslations from "./postContentTranslations";
import useShowTranslations from "next-common/hooks/useShowTranslations";

const Wrapper = styled.div`
  :hover {
    .edit {
      display: block;
    }
  }
`;

export function BannerImage({ bannerCid }) {
  const bannerUrl = getBannerUrl(bannerCid);
  if (!bannerUrl) {
    return null;
  }

  // eslint-disable-next-line
  return <img src={bannerUrl} className="w-full mb-4" alt="banner image" />;
}

export default function ArticleContent({
  setIsEdit,
  className = "",
  isFold = false,
}) {
  const post = usePost();
  const showTranslations = useShowTranslations();

  const postContent = (
    <>
      <BannerImage bannerCid={post.bannerCid} />
      <PostContent post={post} isFold={isFold} />
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
    showTranslations && {
      value: "content_translations",
      label: "Translations",
      content: <PostContentTranslations post={post} isFold={isFold} />,
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
          {post.contentSummary?.summary || showTranslations ? (
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
