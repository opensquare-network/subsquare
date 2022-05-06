import styled from "styled-components";
import Back from "next-common/components/back";
import DetailItem from "components/detailItem";
import Comments from "next-common/components/comment";
import { withLoginUser, withLoginUserRedux } from "lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import Editor from "next-common/components/comment/editor";
import { useState, useRef, useEffect } from "react";
import Layout from "components/layout";
import { getFocusEditor, getMentionList, getOnReply } from "utils/post";
import CommentsWrapper from "next-common/components/styled/commentsWrapper";
import { to404 } from "next-common/utils/serverSideUtil";
import { TYPE_POST } from "utils/viewConstants";
import { getMetaDesc } from "utils/viewfuncs";
import { fetchIdentity } from "next-common//services/identity";
import { addressEllipsis } from "next-common/utils";
import { encodeAddressToChain } from "next-common/services/address";
import { nodes } from "next-common/utils/constants";

const Wrapper = styled.div`
  > :not(:first-child) {
    margin-top: 16px;
  }
  max-width: 848px;
  margin: auto;
`;

export default withLoginUserRedux(({ loginUser, detail, comments, chain }) => {
  const postId = detail._id;

  const editorWrapperRef = useRef(null);
  const [quillRef, setQuillRef] = useState(null);
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState(
    loginUser?.preference.editor || "markdown"
  );

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const users = getMentionList(comments);

    const loadSuggestions = async () => {
      return await Promise.all(
        (users || [])
          .map(async (user) => {
            if (user.startsWith("polkadot-key-0x")) {
              const publicKey = user.substr(15);
              const address = encodeAddressToChain(Buffer.from(publicKey, "hex"), chain);
              const identityChain = nodes.find((n) => n.value === chain)?.identity;
              if (!identityChain) return;

              const identity = await fetchIdentity(identityChain, address);
              const displayName = identity?.info?.displayParent
                ? `${identity?.info?.displayParent}/${identity?.info?.display}`
                : identity?.info?.display;

              const name = displayName || addressEllipsis(address);
              return {
                name,
                value: user,
              };
            }
            return {
              name: user,
              value: user,
            };
          })
      );
    };

    loadSuggestions().then((suggestions) => {
      setUsers(suggestions);
    });
  }, [comments]);

  const focusEditor = getFocusEditor(contentType, editorWrapperRef, quillRef);

  const onReply = getOnReply(
    contentType,
    content,
    setContent,
    quillRef,
    focusEditor
  );

  const desc = getMetaDesc(detail, "Discussion");
  return (
    <Layout
      user={loginUser}
      chain={chain}
      seoInfo={{ title: detail?.title, desc }}
    >
      <Wrapper className="post-content">
        <Back href={`/discussions`} text="Back to Discussions" />
        <DetailItem
          data={detail}
          user={loginUser}
          chain={chain}
          onReply={focusEditor}
          type={TYPE_POST}
        />
        <CommentsWrapper>
          <Comments
            data={comments}
            user={loginUser}
            chain={chain}
            onReply={onReply}
          />
          {loginUser && (
            <Editor
              postId={postId}
              chain={chain}
              ref={editorWrapperRef}
              setQuillRef={setQuillRef}
              {...{ contentType, setContentType, content, setContent, users }}
              type={TYPE_POST}
            />
          )}
        </CommentsWrapper>
      </Wrapper>
    </Layout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;
  const { id, page, page_size: pageSize } = context.query;

  const [{ result: detail }] = await Promise.all([
    nextApi.fetch(`posts/${id}`),
  ]);

  if (!detail) {
    return to404(context);
  }

  const postId = detail._id;

  const { result: comments } = await nextApi.fetch(`posts/${postId}/comments`, {
    page: page ?? "last",
    pageSize: Math.min(pageSize ?? 50, 100),
  });

  return {
    props: {
      detail,
      comments: comments ?? EmptyList,
      chain,
    },
  };
});
