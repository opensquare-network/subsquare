import { Title } from "../styled";

export default function VotesListTitle({ length, disabled }) {
  return (
    <div className="flex gap-[8px]">
      <Title disabled={disabled}>On-chain Votes</Title>
      <span className="text-textTertiary">{length || 0}</span>
    </div>
  );
}
