import { useDispatch } from "react-redux";
import { setEditingPost } from "../../../../store/reducers/userSlice";
import { useCallback } from "react";

export default function useSetEdit() {
  const dispatch = useDispatch();
  return useCallback((editing) => {
    dispatch(setEditingPost(editing));
  }, [dispatch]);
}
