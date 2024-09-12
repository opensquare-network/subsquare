import { usePostState } from "next-common/context/post";
import ClaimedInfo from "./ClaimedInfo";
import Claim from "./claim";

export default function ChildBountyClaim() {
  const state = usePostState();
  if ("Claimed" === state) {
    return <ClaimedInfo />;
  }

  return <Claim />;
}
