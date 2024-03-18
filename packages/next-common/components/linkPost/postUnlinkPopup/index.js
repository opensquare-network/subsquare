import React, { useCallback, useState } from "react";
import Popup from "../../popup/wrapper/Popup";
import nextApi from "../../../services/nextApi";
import { useDispatch } from "react-redux";
import { addToast } from "../../../store/reducers/toastSlice";
import { toApiType } from "../../../utils/viewfuncs";
import { usePost } from "../../../context/post";
import { noop } from "lodash-es";
import { useRouter } from "next/router";
import PrimaryButton from "next-common/lib/button/primary";
import { Info } from "../styled";
import { useDetailType } from "../../../context/page";
import { PopupButtonWrapper } from "../../popup/wrapper";

export default function PostUnlinkPopup({ setShow = noop }) {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const post = usePost();
  const postType = useDetailType();
  const router = useRouter();

  const unbindDiscussion = useCallback(async () => {
    if (!post?._id) {
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await nextApi.post(
        `${toApiType(postType)}/${post?._id}/unbind`,
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
          message: "Unlinked",
        }),
      );
      setShow(false);

      // reload server prop
      router.replace(router.asPath);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, postType, post?._id, router]);

  return (
    <Popup title="Unlink post" onClose={() => setShow(false)}>
      <Info>
        Unlinking will reset the content and comments of the currently linked
        post.
      </Info>
      <PopupButtonWrapper>
        <PrimaryButton isLoading={isLoading} onClick={unbindDiscussion}>
          Confirm
        </PrimaryButton>
      </PopupButtonWrapper>
    </Popup>
  );
}
