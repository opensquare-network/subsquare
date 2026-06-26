import { noop } from "lodash-es";
import { useState, useCallback } from "react";
import { HideMenuItem } from "./menuItems";
import dynamicPopup from "next-common/lib/dynamic/popup";
import nextApi from "next-common/services/nextApi";
import { usePost } from "next-common/context/post";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

const HidePopup = dynamicPopup(() =>
  import("next-common/components/deletePopup/hidePopup"),
);

export default function PostHideMenu({ setShow = noop }) {
  const [showHidePopup, setShowHidePopup] = useState(false);
  const post = usePost();
  const dispatch = useDispatch();
  const router = useRouter();

  const hidden = !!post.hide;

  const doHide = useCallback(async () => {
    const { error } = await nextApi.patch(`posts/${post._id}/hide`, {
      hide: !hidden,
    });
    if (error) {
      dispatch(newErrorToast(error.message));
      return;
    }

    setShowHidePopup(false);

    if (!hidden) {
      router.replace("/discussions");
    } else {
      router.replace(router.asPath);
    }
  }, [dispatch, hidden, post._id, router]);

  return (
    <div>
      <HideMenuItem
        hidden={hidden}
        onClick={() => {
          setShowHidePopup(true);
          setShow(false);
        }}
      />
      {showHidePopup && (
        <HidePopup hidden={hidden} setShow={setShowHidePopup} doHide={doHide} />
      )}
    </div>
  );
}
