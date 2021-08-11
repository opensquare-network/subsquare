import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { fetchUserProfile } from "store/reducers/userSlice";

export default function Auth() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, []);
  return null;
}
