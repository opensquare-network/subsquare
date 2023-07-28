import { PageTitleContainer } from "../styled/containers/titleContainer";
import AddressLogin from "./addressLogin";

export default function LoginPopupWeb3LoginContent({ setView }) {
  return (
    <div>
      <PageTitleContainer>Login</PageTitleContainer>

      <AddressLogin setView={setView} />
    </div>
  );
}
