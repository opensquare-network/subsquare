import React, { useCallback, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import Popup from "../../popup/wrapper/Popup";
import nextApi from "../../../services/nextApi";
import { useDispatch } from "react-redux";
import { useUser } from "../../../context/user";
import { addToast } from "../../../store/reducers/toastSlice";
import { toApiType } from "../../../utils/viewfuncs";
import { usePost } from "../../../context/post";
import { noop } from "lodash-es";
import { useRouter } from "next/router";
import PrimaryButton from "../../buttons/primaryButton";
import Loading from "../../loading";
import { Info } from "../styled";
import { useDetailType } from "../../../context/page";
import Input from "../../input";
import { PopupButtonWrapper } from "../../popup/wrapper";
import tw from "tailwind-styled-components";

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SectionTitle = tw.span`
  text12Bold text-textPrimary
`;

const Discussion = styled.div`
  display: flex;
  cursor: pointer;
  padding: 10px 16px;
  color: var(--textPrimary);
  background: var(--neutral200);
  ${(p) =>
    p.selected &&
    css`
      background: var(--neutral300);
    `}
  border-radius: 4px;
`;

function getDiscussionUrl(discussion) {
  if (!discussion) {
    return "";
  }
  return `${process.env.NEXT_PUBLIC_SITE_URL}/posts/${discussion.postUid}`;
}

export default function PostLinkPopup({ setShow = noop }) {
  const [myDiscussions, setMyDiscussions] = useState([]);
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [postUrl, setPostUrl] = useState("");
  const user = useUser();
  const dispatch = useDispatch();
  const post = usePost();
  const postType = useDetailType();
  const router = useRouter();

  useEffect(() => {
    if (!user?.address) {
      return;
    }

    setMyDiscussions([]);

    setIsLoadingList(true);
    nextApi
      .fetch(`users/${user?.address}/all-posts`)
      .then(({ result, error }) => {
        if (error) {
          dispatch(
            addToast({
              type: "error",
              message: error.message,
            }),
          );
          return;
        }

        setMyDiscussions(result);
      })
      .finally(() => {
        setIsLoadingList(false);
      });
  }, [dispatch, user]);

  const bindDiscussion = useCallback(async () => {
    if (!post?._id) {
      return;
    }

    if (!selectedDiscussion) {
      dispatch(
        addToast({
          type: "error",
          message: "Please select a post",
        }),
      );
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await nextApi.post(
        `${toApiType(postType)}/${post?._id}/bind`,
        {
          discussionId: selectedDiscussion._id,
        },
      );

      if (error) {
        dispatch(
          addToast({
            type: "error",
            message: error.message,
          }),
        );
        return;
      }

      dispatch(
        addToast({
          type: "success",
          message: "Post linked",
        }),
      );
      setShow(false);

      // reload server prop
      router.replace(router.asPath);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, postType, post?._id, router, selectedDiscussion]);

  const onSelectDiscussion = useCallback((discussion) => {
    setSelectedDiscussion(discussion);
    const discussionUrl = getDiscussionUrl(discussion);
    setPostUrl(discussionUrl);
  }, []);

  useEffect(() => {
    const item = (myDiscussions || []).find(
      (item) => getDiscussionUrl(item) === postUrl,
    );
    setSelectedDiscussion(item);
  }, [postUrl]);

  let discussionList = (
    <div className="flex justify-center items-center text14Medium text-textTertiary">
      {isLoadingList ? <Loading size={16} /> : "No posts"}
    </div>
  );

  if (myDiscussions?.length) {
    discussionList = myDiscussions.map((discussion, index) => (
      <Discussion
        key={index}
        selected={selectedDiscussion === discussion}
        onClick={() => onSelectDiscussion(discussion)}
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
        <SectionTitle>Paste URL</SectionTitle>
        <Input
          value={postUrl || ""}
          placeholder="Please fill available URL..."
          onChange={(e) => setPostUrl(e.target.value)}
        />
      </Section>
      <Section>
        <SectionTitle>Link to a post</SectionTitle>
        {discussionList}
      </Section>
      <PopupButtonWrapper>
        <PrimaryButton
          isLoading={isLoading}
          disabled={isLoadingList || !selectedDiscussion}
          onClick={bindDiscussion}
        >
          Confirm
        </PrimaryButton>
      </PopupButtonWrapper>
    </Popup>
  );
}
