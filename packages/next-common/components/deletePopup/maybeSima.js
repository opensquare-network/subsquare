import { noop } from "lodash-es";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import DeletePopup, {
  DeletePopupImpl,
} from "next-common/components/deletePopup";

export default function MaybeSimaDeletePopup({
  isSima = false,
  itemName = "item",
  setShow = noop,
  deletePost = noop,
}) {
  if (isSima) {
    return (
      <SimaDeletePopup
        itemName={itemName}
        setShow={setShow}
        deletePost={deletePost}
      />
    );
  }
  return (
    <DeletePopup
      itemName={itemName}
      setShow={setShow}
      deletePost={deletePost}
    />
  );
}

function SimaDeletePopup({
  itemName = "item",
  setShow = noop,
  deletePost = noop,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const doDelete = useCallback(async () => {
    setIsLoading(true);
    try {
      await deletePost();
      setShow(false);
    } catch (error) {
      if (error?.message) {
        setShow(false);
        dispatch(newErrorToast(error.message));
      }
    } finally {
      setIsLoading(false);
    }
  }, [deletePost, dispatch, setShow]);

  return (
    <DeletePopupImpl
      itemName={itemName}
      setShow={setShow}
      isLoading={isLoading}
      doDelete={doDelete}
    />
  );
}
