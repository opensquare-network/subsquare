import { ListCard } from "../styled";

export default function EmptyList() {
  return (
    <ListCard>
      <div className="w-full text-center text-textTertiary">
        No current data
      </div>
    </ListCard>
  );
}
