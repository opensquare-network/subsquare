import { usePostState } from "next-common/context/post";
import ClaimedInfo from "./ClaimedInfo";
import Claim from "./claim";
import { MigrationConditionalApiProvider } from "next-common/context/migration/conditionalApi";

export default function BountyClaim() {
  const state = usePostState();
  if ("Claimed" === state) {
    return <ClaimedInfo />;
  }

  return (
    <MigrationConditionalApiProvider>
      <Claim />
    </MigrationConditionalApiProvider>
  );
}
