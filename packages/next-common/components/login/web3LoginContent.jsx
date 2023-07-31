import { PageTitleContainer } from "../styled/containers/titleContainer";
import AddressLogin from "./addressLogin";

export default function LoginWeb3LoginContent({ setView }) {
  return (
    <div className="space-y-6">
      <PageTitleContainer>Login to SubSquare</PageTitleContainer>

      <AddressLogin setView={setView} />
    </div>
  );
}
