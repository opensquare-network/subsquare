import { Title } from "../styled";

export default function VotesListTitle({ length }) {
  return (
    <div className="flex gap-[8px]">
      <Title>On-chain Votes</Title>
      <span className="text-textTertiary">{length || 0}</span>
    </div>
  );
}
