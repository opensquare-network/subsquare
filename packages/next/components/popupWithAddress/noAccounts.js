import { Message } from "./styled";

export default function NoAccounts() {
  return (
    <Message>
      Polkadot-js extension is connected, but no account found. Please create or
      import some accounts first.
    </Message>
  );
}
