import { useState } from "react";
import styled from "styled-components";
import ArticleActions from "./actions/articleActions";
import Poll from "./poll";
import RichTextStyleWrapper from "./content/richTextStyleWrapper";
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
`;

export default function ArticleContent({ setIsEdit, className = "" }) {
  const post = usePost();
  const bannerUrl = getBannerUrl(post.bannerCid);

  const postContent = (
    <>
      {bannerUrl && <BannerImage src={bannerUrl} alt="banner image" />}

      <RichTextStyleWrapper className="[&_.markdown-body>*]:first:mt-0">
        <PostContent />
      </RichTextStyleWrapper>

      {isPostEdited(post) && (
        <span className="text12Medium text-textTertiary">Edited</span>
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
      tooltip: "Powered by OpenAI",
      content: (
        <RichTextStyleWrapper className="[&_.markdown-body>*]:first:mt-0">
          <ContentSummary />
        </RichTextStyleWrapper>
      ),
    },
  ].filter(Boolean);
  const [activeTab, setActiveTab] = useState(tabs[0].label);

  return (
    <Wrapper className={className}>
      {!post.content && <NonEdited setIsEdit={setIsEdit} />}

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
