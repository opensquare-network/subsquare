import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { p_12_bold, p_14_normal } from "../../styles/componentCss";
import Popup from "../popup/wrapper/Popup";
import nextApi from "../../services/nextApi";
import { useDispatch } from "react-redux";
import { useUser } from "../../context/user";
import { addToast } from "../../store/reducers/toastSlice";
import { postTypeToApi } from "../../utils/viewfuncs";
import { usePost } from "../../context/post";
import noop from "lodash.noop";
import { useRouter } from "next/router";

const Info = styled.div`
  padding: 10px 16px;
  background: #f6f7fa;
  border-radius: 4px;

  ${p_14_normal}
  color: #506176;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SectionTitle = styled.div`
  ${p_12_bold}
  color: #1E2134;
`;

const Discussion = styled.div`
  display: flex;
  cursor: pointer;
  padding: 10px 16px;
  background: #ebeef4;
  border-radius: 4px;
`;

const NoDiscussion = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  ${p_14_normal}
  color: #9DA9BB;
`;

export default function PostLinkPopup({ setShow = noop }) {
  const [myDiscussions, setMyDiscussions] = useState([]);
  const user = useUser();
  const dispatch = useDispatch();
  const post = usePost();
  const router = useRouter();
  const { postType: rootPostType, postId: rootPostId } = post.rootPost || {};

  useEffect(() => {
    if (!user?.address) {
      return;
    }
    //TODO: should load all discussions
    nextApi.fetch(`users/${user?.address}/posts`).then(({ result, error }) => {
      if (error) {
        dispatch(
          addToast({
            type: "error",
            message: error.message,
          })
        );
        return;
      }
      setMyDiscussions(result.items);
    });
    setMyDiscussions([]);
  }, [dispatch, user]);

  const bindDiscussion = useCallback(
    async (discussion) => {
      if (!post?.rootPost) {
        return;
      }
      nextApi
        .post(`${postTypeToApi(rootPostType)}/${rootPostId}/bind`, {
          discussionId: discussion._id,
        })
        .then(({ error }) => {
          if (error) {
            dispatch(
              addToast({
                type: "error",
                message: error.message,
              })
            );
            return;
          }

          dispatch(
            addToast({
              type: "success",
              message: "Post linked",
            })
          );
          setShow(false);

          // reload server prop
          router.replace(router.asPath);
        });
    },
    [dispatch, rootPostType, rootPostId, router]
  );

  return (
    <Popup title="Link post" onClose={() => setShow(false)}>
      <Info>
        Linking a post will use the linked content and comments, existing
        comments will be hidden.
      </Info>
      <Section>
        <SectionTitle>Link to a post</SectionTitle>
        {myDiscussions.length === 0 ? (
          <NoDiscussion>No posts</NoDiscussion>
        ) : (
          myDiscussions.map((discussion, index) => (
            <Discussion key={index} onClick={() => bindDiscussion(discussion)}>
              {discussion.title}
            </Discussion>
          ))
        )}
      </Section>
    </Popup>
  );
}
