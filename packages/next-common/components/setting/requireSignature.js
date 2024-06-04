import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import PrimaryButton from "next-common/lib/button/primary";
import { ContentWrapper, InfoMessage } from "./styled";

export default function RequireSignature({ name }) {
  const { ensureLogin } = useEnsureLogin();
  return (
    <ContentWrapper>
      <InfoMessage className="mb-4">
        Please complete your signature before continuing with {name}
        Settings.
      </InfoMessage>
      <PrimaryButton onClick={ensureLogin}>
        Sign with connected wallet
      </PrimaryButton>
    </ContentWrapper>
  );
}
