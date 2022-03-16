import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { fetchUserProfile } from "next-common/store/reducers/userSlice";
import useUpdateNodesDelay from "next-common/utils/hooks/useUpdateNodesDelay";

export default function Auth({ chain }) {
  const dispatch = useDispatch();
  useUpdateNodesDelay(chain);
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);
  return null;
}
