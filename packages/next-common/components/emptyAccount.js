import Account from "./account";
import PseudoAvatar from "../assets/imgs/pesudoAvatar.svg";

export default function EmptyAccount() {
  return (
    <>
      <PseudoAvatar />
      <Account
        account={{
          address: "--",
          name: "--",
        }}
      />
    </>
  );
}
