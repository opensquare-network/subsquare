import DetailItem from "components/detailItem";
import Comments from "next-common/components/comment";
import { withCommonProps } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import CommentEditor from "next-common/components/comment/editor";
import { useRef, useState } from "react";
import { getFocusEditor } from "next-common/utils/post";
import useMentionList from "next-common/utils/hooks/useMentionList";
import { to404 } from "next-common/utils/serverSideUtil";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import DetailLayout from "next-common/components/layout/DetailLayout";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider } from "next-common/context/post";
import {
  fetchDetailComments,
  getPostVotesAndMine,
} from "next-common/services/detail";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { useUser } from "next-common/context/user";
import { EditorProvider } from "next-common/context/post/editor";

export default function PostDetailPage({ detail, comments, votes, myVote }) {
  const loginUser = useUser();
  const postId = detail._id;
  const editorWrapperRef = useRef(null);
  const [quillRef, setQuillRef] = useState(null);
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState(
    loginUser?.preference.editor || "markdown",
  );
  const users = useMentionList(detail, comments);

  const focusEditor = getFocusEditor(contentType, editorWrapperRef, quillRef);

  const desc = getMetaDesc(detail);
  return (
    <PostProvider post={detail}>
      <DetailLayout
        seoInfo={{
          title: detail?.title,
          desc,
          ogImage: getBannerUrl(detail?.bannerCid),
        }}
      >
        <EditorProvider focusEditor={focusEditor}>
          <DetailItem votes={votes} myVote={myVote} />
          <Comments data={comments} />
          {loginUser && (
            <CommentEditor
              postId={postId}
              ref={editorWrapperRef}
              setQuillRef={setQuillRef}
              {...{ contentType, setContentType, content, setContent, users }}
            />
          )}
        </EditorProvider>
      </DetailLayout>
    </PostProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { id } = context.query;

  const [{ result: detail }] = await Promise.all([
    nextApi.fetch(`posts/${id}`),
  ]);

  if (!detail) {
    return to404();
  }

  const comments = await fetchDetailComments(
    `posts/${detail._id}/comments`,
    context,
  );
  const { votes, myVote } = await getPostVotesAndMine(detail, context);
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      detail,
      comments: comments ?? EmptyList,
      votes,
      myVote: myVote ?? null,

      ...tracksProps,
    },
  };
});
