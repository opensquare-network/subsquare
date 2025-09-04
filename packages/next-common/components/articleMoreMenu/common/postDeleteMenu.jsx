import { noop } from "lodash-es";
import { useState, useCallback } from "react";
import { DeleteMenuItem } from "./menuItems";
import dynamicPopup from "next-common/lib/dynamic/popup";
import nextApi from "next-common/services/nextApi";
import { usePost } from "next-common/context/post";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

const DeletePopup = dynamicPopup(() =>
  import("next-common/components/deletePopup"),
);

export default function PostDeleteMenu({ setShow = noop }) {
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const post = usePost();
  const dispatch = useDispatch();
  const router = useRouter();

  const deletePost = useCallback(async () => {
    const { error } = await nextApi.delete(`posts/${post._id}`);
    if (error) {
      dispatch(newErrorToast(error.message));
      return;
    }
    router.replace("/discussions");
  }, [dispatch, post._id, router]);

  return (
    <div>
      <DeleteMenuItem
        setShowDeletePopup={setShowDeletePopup}
        setShow={setShow}
      />
      {showDeletePopup && (
        <DeletePopup
          itemName="post"
          setShow={setShowDeletePopup}
          deletePost={deletePost}
        />
      )}
    </div>
  );
}
