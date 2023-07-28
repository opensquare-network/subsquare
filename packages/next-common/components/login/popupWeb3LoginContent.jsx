import { PageTitleContainer } from "../styled/containers/titleContainer";
import AddressLogin from "./addressLogin";

export default function LoginPopupWeb3LoginContent({ onClose, setView }) {
  return (
    <div>
      <PageTitleContainer>Login</PageTitleContainer>

      <AddressLogin onClose={onClose} setView={setView} />
    </div>
  );
}
