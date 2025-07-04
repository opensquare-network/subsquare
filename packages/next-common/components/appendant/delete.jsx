import { useCallback } from "react";
import { noop } from "lodash-es";
import { useDispatch } from "react-redux";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import { appendantsApi } from "next-common/services/url";
import nextApi from "next-common/services/nextApi";
import { useRouter } from "next/router";
import dynamicPopup from "next-common/lib/dynamic/popup";

const DeletePopup = dynamicPopup(() =>
  import("next-common/components/deletePopup"),
);

export default function DeleteAppendantPopup({
  appendantData,
  setShow = noop,
}) {
  const dispatch = useDispatch();
  const router = useRouter();

  const deletePost = useCallback(async () => {
    try {
      const deleteApi = appendantsApi(appendantData?._id);
      const { result, error } = await nextApi.delete(deleteApi);

      if (error) {
        dispatch(newErrorToast(error.message || "Failed to delete appendant"));
      }

      if (result) {
        dispatch(newSuccessToast("Appendant deleted successfully"));
        router.replace(router.asPath);
      }
    } catch (e) {
      console.error(e);
      dispatch(newErrorToast("An error occurred while deleting"));
      throw e;
    }
  }, [appendantData?._id, dispatch, router]);

  return (
    <DeletePopup
      itemName="appendant"
      setShow={setShow}
      deletePost={deletePost}
    />
  );
}
