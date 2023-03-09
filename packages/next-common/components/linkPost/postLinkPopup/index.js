import React, { useCallback, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { p_12_bold, p_14_normal } from "../../../styles/componentCss";
import Popup from "../../popup/wrapper/Popup";
import nextApi from "../../../services/nextApi";
import { useDispatch } from "react-redux";
import { useUser } from "../../../context/user";
import { addToast } from "../../../store/reducers/toastSlice";
import { postTypeToApi } from "../../../utils/viewfuncs";
import { usePost } from "../../../context/post";
import noop from "lodash.noop";
import { useRouter } from "next/router";
import SecondaryButton from "../../buttons/secondaryButton";
import Loading from "../../loading";
import { Info, ButtonWrapper } from "../styled";

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SectionTitle = styled.span`
  ${p_12_bold}
  color: #1E2134;
`;

const Discussion = styled.div`
  display: flex;
  cursor: pointer;
  padding: 10px 16px;
  background: #f6f7fa;
  ${(p) =>
    p.selected &&
    css`
      background: #ebeef4;
    `}
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
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const user = useUser();
  const dispatch = useDispatch();
  const post = usePost();
  const router = useRouter();
  const { postType: rootPostType, postId: rootPostId } = post.rootPost || {};

  useEffect(() => {
    if (!user?.address) {
      return;
    }

    setMyDiscussions([]);

    //TODO: should load all discussions
    setIsLoadingList(true);
    nextApi
      .fetch(`users/${user?.address}/posts`)
      .then(({ result, error }) => {
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
      })
      .finally(() => {
        setIsLoadingList(false);
      });
  }, [dispatch, user]);

  const bindDiscussion = useCallback(async () => {
    if (!rootPostId) {
      return;
    }

    if (!selectedDiscussion) {
      dispatch(
        addToast({
          type: "error",
          message: "Please select a post",
        })
      );
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await nextApi.post(
        `${postTypeToApi(rootPostType)}/${rootPostId}/bind`,
        {
          discussionId: selectedDiscussion._id,
        }
      );

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
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, rootPostType, rootPostId, router, selectedDiscussion]);

  let discussionList = (
    <NoDiscussion>
      {isLoadingList ? <Loading size={16} /> : "No posts"}
    </NoDiscussion>
  );

  if (myDiscussions?.length) {
    discussionList = myDiscussions.map((discussion, index) => (
      <Discussion
        key={index}
        selected={selectedDiscussion === discussion}
        onClick={() => setSelectedDiscussion(discussion)}
      >
        {discussion.title}
      </Discussion>
    ));
  }

  return (
    <Popup title="Link post" onClose={() => setShow(false)}>
      <Info>
        Linking a post will use the linked content and comments, existing
        comments will be hidden.
      </Info>
      <Section>
        <SectionTitle>Link to a post</SectionTitle>
        {discussionList}
      </Section>
      <ButtonWrapper>
        <SecondaryButton
          isLoading={isLoading}
          disabled={isLoadingList}
          onClick={bindDiscussion}
        >
          Confirm
        </SecondaryButton>
      </ButtonWrapper>
    </Popup>
  );
}
