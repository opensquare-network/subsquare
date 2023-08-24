import DetailItem from "components/detailItem";
import Comments from "next-common/components/comment";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import CommentEditor from "next-common/components/comment/editor";
import { useRef, useState } from "react";
import { getFocusEditor } from "next-common/utils/post";
import useMentionList from "next-common/utils/hooks/useMentionList";
import { to404 } from "next-common/utils/serverSideUtil";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import Cookies from "cookies";
import DetailLayout from "next-common/components/layout/DetailLayout";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider } from "next-common/context/post";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";

export default withLoginUserRedux(
  ({ loginUser, detail, comments, votes, myVote }) => {
    const postId = detail._id;
    const editorWrapperRef = useRef(null);
    const [quillRef, setQuillRef] = useState(null);
    const [content, setContent] = useState("");
    const [contentType, setContentType] = useState(
      loginUser?.preference.editor || "markdown",
    );
    const users = useMentionList(detail, comments);

    const focusEditor = getFocusEditor(contentType, editorWrapperRef, quillRef);

    const breadcrumbItems = [
      {
        content: "Discussions",
        path: "/discussions",
      },
      {
        content: "#" + detail?.postUid,
      },
    ];

    const desc = getMetaDesc(detail);
    return (
      <PostProvider post={detail}>
        <DetailLayout
          seoInfo={{
            title: detail?.title,
            desc,
            ogImage: getBannerUrl(detail?.bannerCid),
          }}
          breadcrumbs={breadcrumbItems}
        >
          <DetailItem votes={votes} myVote={myVote} onReply={focusEditor} />
          <Comments data={comments} />
          {loginUser && (
            <CommentEditor
              postId={postId}
              ref={editorWrapperRef}
              setQuillRef={setQuillRef}
              {...{ contentType, setContentType, content, setContent, users }}
            />
          )}
        </DetailLayout>
      </PostProvider>
    );
  },
);

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;
  const { id, page, page_size: pageSize } = context.query;

  const [{ result: detail }] = await Promise.all([
    nextApi.fetch(`posts/${id}`),
  ]);

  if (!detail) {
    return to404();
  }

  const postId = detail._id;

  const { result: comments } = await nextApi.fetch(`posts/${postId}/comments`, {
    page: page ?? "last",
    pageSize: Math.min(pageSize ?? 50, 100),
  });

  let options;
  const cookies = new Cookies(context.req, context.res);
  const authToken = cookies.get("auth-token");
  if (authToken) {
    options = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
  }

  let votes = null;
  let myVote = null;
  if (detail.poll) {
    ({ result: votes } = await nextApi.fetch(`polls/${detail.poll._id}/votes`));
    ({ result: myVote } = await nextApi.fetch(
      `polls/${detail.poll._id}/myvote`,
      {},
      options,
    ));
  }

  const [{ result: tracks }, { result: fellowshipTracks }] = await Promise.all([
    nextApi.fetch(gov2TracksApi),
    nextApi.fetch(fellowshipTracksApi),
  ]);

  return {
    props: {
      detail,
      comments: comments ?? EmptyList,
      votes,
      myVote: myVote ?? null,
      chain,

      tracks: tracks ?? [],
      fellowshipTracks: fellowshipTracks ?? [],
    },
  };
});
