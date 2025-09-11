import React, { useCallback, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import Popup from "../../popup/wrapper/Popup";
import nextApi from "../../../services/nextApi";
import { useDispatch } from "react-redux";
import { addToast } from "../../../store/reducers/toastSlice";
import { toApiType } from "../../../utils/viewfuncs";
import { usePost } from "../../../context/post";
import { noop } from "lodash-es";
import { useRouter } from "next/router";
import PrimaryButton from "next-common/lib/button/primary";
import Loading from "../../loading";
import { Info } from "../styled";
import { useDetailType } from "../../../context/page";
import Input from "next-common/lib/input";
import { PopupButtonWrapper } from "../../popup/wrapper";
import tw from "tailwind-styled-components";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import { useArticleActions } from "next-common/sima/context/articleActions";

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px !important;
`;

const SectionTitle = tw.span`
  text14Bold text-textPrimary
`;

const Discussion = styled.div`
  display: flex;
  cursor: pointer;
  padding: 10px 16px;
  background: var(--neutral200);
  overflow: hidden;
  color: var(--textPrimary);
  text-overflow: ellipsis;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  background: rgba(0, 0, 0, 0);
  border-radius: 8px;
  border: 1px solid var(--neutral400);
  ${(p) =>
    p.selected &&
    css`
      background: var(--neutral200);
    `}
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
  const dispatch = useDispatch();
  const post = usePost();
  const postType = useDetailType();
  const router = useRouter();
  const { ensureLogin } = useEnsureLogin();
  const { getUserDiscussions } = useArticleActions();

  useEffect(() => {
    setMyDiscussions([]);

    setIsLoadingList(true);
    getUserDiscussions()
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
  }, [dispatch, getUserDiscussions]);

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
      if (!(await ensureLogin())) {
        return;
      }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, postType, post?._id, router, selectedDiscussion, ensureLogin]);

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
  }, [myDiscussions, postUrl]);

  let discussionList = (
    <div className="flex justify-center items-center text14Medium text-textPrimary">
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
      <Section className="!gap-[8px]">
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
          loading={isLoading}
          disabled={isLoadingList || !selectedDiscussion}
          onClick={bindDiscussion}
        >
          Confirm
        </PrimaryButton>
      </PopupButtonWrapper>
    </Popup>
  );
}
