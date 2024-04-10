import { SecondaryCard } from "../styled/containers/secondaryCard";
import { TitleContainer } from "../styled/containers/titleContainer";
import WhalesCurrentList from "./currentList";

export default function WhalesList() {
  return (
    <div className="space-y-4">
      <TitleContainer>List</TitleContainer>

      <SecondaryCard className="!p-6">
        <WhalesCurrentList />
      </SecondaryCard>
    </div>
  );
}
