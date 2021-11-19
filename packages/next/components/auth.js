import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { fetchUserProfile } from "store/reducers/userSlice";
import useUpdateNodesDelay from "utils/useUpdateNodesDelay";

export default function Auth({ chain }) {
  const dispatch = useDispatch();
  useUpdateNodesDelay(chain);
  useEffect(() => {
    dispatch(fetchUserProfile());
  });
  return null;
}
