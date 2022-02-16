import { Message } from "./styled";

export default function Inaccessible() {
  return (
    <Message>
      Polkadot-js extension is detected but unaccessible, please go to
      Polkadot-js extension, settings, and check Manage Website Access section.
    </Message>
  );
}
