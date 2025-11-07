import { usePostState } from "next-common/context/post";
import ClaimedInfo from "./ClaimedInfo";
import Claim from "./claim";
import { MigrationConditionalApiProvider } from "next-common/context/migration/conditionalApi";

export function ChildBountyClaimed() {
  const state = usePostState();
  if ("Claimed" === state) {
    return <ClaimedInfo />;
  } else {
    return null;
  }
}

export default function ChildBountyClaim() {
  return (
    <MigrationConditionalApiProvider>
      <Claim />
    </MigrationConditionalApiProvider>
  );
}
