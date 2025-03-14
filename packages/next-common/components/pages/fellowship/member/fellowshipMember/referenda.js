import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { CardTitle } from "./styled";

export default function Referenda() {
  return (
    <div>
      <h1 className="text16Bold ml-[24px] mb-[16px] text-textPrimary">
        Referenda
      </h1>
      <SecondaryCard>
        <CardTitle>Referenda</CardTitle>
      </SecondaryCard>
    </div>
  );
}
