import React, { useCallback, useState } from "react";
import Popup from "../../popup/wrapper/Popup";
import { backendApi } from "../../../services/nextApi";
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
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";

export default function PostUnlinkPopup({ setShow = noop }) {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const post = usePost();
  const postType = useDetailType();
  const router = useRouter();
  const { ensureLogin } = useEnsureLogin();

  const unbindDiscussion = useCallback(async () => {
    if (!post?._id) {
      return;
    }

    setIsLoading(true);
    try {
      if (!(await ensureLogin())) {
        return;
      }

      const { error } = await backendApi.post(
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
  }, [dispatch, postType, post?._id, router, ensureLogin, setShow]);

  return (
    <Popup title="Unlink post" onClose={() => setShow(false)}>
      <Info>
        Unlinking will reset the content and comments of the currently linked
        post.
      </Info>
      <PopupButtonWrapper>
        <PrimaryButton loading={isLoading} onClick={unbindDiscussion}>
          Confirm
        </PrimaryButton>
      </PopupButtonWrapper>
    </Popup>
  );
}
