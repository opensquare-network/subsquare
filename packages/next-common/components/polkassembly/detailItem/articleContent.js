import styled from "styled-components";
import PolkassemblyActions from "next-common/components/polkassembly/actions";
import PostDataSource from "next-common/components/postDataSource";
import { MarkdownPreviewer } from "@osn/previewer";
import RichTextStyleWrapper from "next-common/components/content/richTextStyleWrapper";
import NoData from "next-common/components/noData";

const Wrapper = styled(RichTextStyleWrapper)``;

const EditedLabel = styled.div`
  margin-top: 8px;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  color: var(--textTertiary);
`;

export default function ArticleContent({ post, postReactions }) {
  if (!post) {
    return null;
  }

  return (
    <Wrapper>
      {post.content === "" && (
        <NoData text={"The post has not been edited by creator."} />
      )}
      <MarkdownPreviewer content={post.content} />
      {post.createdAt !== post.updatedAt && <EditedLabel>Edited</EditedLabel>}
      <PostDataSource post={post} />
      <PolkassemblyActions reactions={postReactions} />
    </Wrapper>
  );
}
