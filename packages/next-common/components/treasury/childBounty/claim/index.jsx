import { usePostState } from "next-common/context/post";
import ClaimedInfo from "./ClaimedInfo";
import Claim from "./claim";

export function ChildBountyClaimed() {
  const state = usePostState();
  if ("Claimed" === state) {
    return <ClaimedInfo />;
  } else {
    return null;
  }
}

export default function ChildBountyClaim() {
  return <Claim />;
}
