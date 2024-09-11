import { usePostState } from "next-common/context/post";
import ClaimedInfo from "./ClaimedInfo";
import Claim from "./claim";

function GuardClaimed({ children }) {
  const state = usePostState();
  if ("Claimed" === state) {
    return <ClaimedInfo />;
  } else {
    return children;
  }
}

export default function BountyClaim() {
  return (
    <GuardClaimed>
      <Claim />
    </GuardClaimed>
  );
}
