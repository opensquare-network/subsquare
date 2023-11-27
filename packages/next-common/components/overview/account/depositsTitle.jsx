import { Title } from "./styled";

export default function DepositsTitle({ active }) {
  return (
    <Title className={active ? "text-textPrimary" : "text-textTertiary"}>
      Deposits
      {true !== null && <span className="text-textTertiary mx-1">{0}</span>}
    </Title>
  );
}
