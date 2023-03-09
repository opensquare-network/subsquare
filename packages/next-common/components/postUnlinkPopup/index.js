import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { p_14_normal } from "../../styles/componentCss";
import Popup from "../popup/wrapper/Popup";
import nextApi from "../../services/nextApi";
import { useDispatch } from "react-redux";
import { addToast } from "../../store/reducers/toastSlice";
import { postTypeToApi } from "../../utils/viewfuncs";
import { usePost } from "../../context/post";
import noop from "lodash.noop";
import { useRouter } from "next/router";
import SecondaryButton from "../buttons/secondaryButton";

const Info = styled.div`
  padding: 10px 16px;
  background: #f6f7fa;
  border-radius: 4px;

  ${p_14_normal}
  color: #506176;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export default function PostUnlinkPopup({ setShow = noop }) {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const post = usePost();
  const router = useRouter();

  const { postType: rootPostType, postId: rootPostId } = post.rootPost || {};

  const unbindDiscussion = useCallback(async () => {
    if (!rootPostId) {
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await nextApi.post(
        `${postTypeToApi(rootPostType)}/${rootPostId}/unbind`
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
          message: "Unlinked",
        })
      );
      setShow(false);

      // reload server prop
      router.replace(router.asPath);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, rootPostType, rootPostId, router]);

  return (
    <Popup title="Unlink post" onClose={() => setShow(false)}>
      <Info>
        Unlinking will reset the content and comments of the currently linked
        post.
      </Info>
      <ButtonWrapper>
        <SecondaryButton isLoading={isLoading} onClick={unbindDiscussion}>
          Confirm
        </SecondaryButton>
      </ButtonWrapper>
    </Popup>
  );
}
