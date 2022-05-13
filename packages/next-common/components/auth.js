import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { userSelector, fetchUserProfile } from "../store/reducers/userSlice";
import useUpdateNodesDelay from "../utils/hooks/useUpdateNodesDelay";

export default function Auth({ chain }) {
  const dispatch = useDispatch();
  const user = useSelector(userSelector);
  useUpdateNodesDelay(chain);
  useEffect(() => {
    if (user === undefined) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user]);
  return null;
}
