import React, { useState } from "react";
import styled from "styled-components";
import ArticleActions from "./actions/articleActions";
import PostDataSource from "./postDataSource";
import Poll from "./poll";
import RichTextStyleWrapper from "./content/richTextStyleWrapper";
import Divider from "./styled/layout/divider";
import NonEdited from "./detail/common/NonEdited";
import PostContent from "./detail/common/PostContent";
import { usePost } from "../context/post";
import { getBannerUrl } from "../utils/banner";
import { isPostEdited } from "next-common/utils/post";
import Tabs from "./tabs";
import AISummaryContent from "./aiSummaryContent";

const Wrapper = styled.div`
  :hover {
    .edit {
      display: block;
    }
  }
`;

const EditedLabel = styled.div`
  margin-top: 8px;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  color: var(--textTertiary);
`;

const BannerImage = styled.img`
  width: 100%;
`;

export default function ArticleContent({ setIsEdit, className = "" }) {
  const post = usePost();
  const bannerUrl = getBannerUrl(post.bannerCid);

  const tabs = [
    {
      label: "Content",
      content: (
        <RichTextStyleWrapper>
          <PostContent />
        </RichTextStyleWrapper>
      ),
    },
    // FIXME: ai, remove flag
    !post.aiSummaryContent && {
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
    <Wrapper className={className}>
      {!post.content && <NonEdited setIsEdit={setIsEdit} />}
      {bannerUrl && <BannerImage src={bannerUrl} alt="banner image" />}

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

      {isPostEdited(post) && <EditedLabel>Edited</EditedLabel>}
      {post.poll && (
        <>
          <Divider margin={16} />
          <Poll />
        </>
      )}
      <PostDataSource />
      <ArticleActions setIsEdit={setIsEdit} />
    </Wrapper>
  );
}
