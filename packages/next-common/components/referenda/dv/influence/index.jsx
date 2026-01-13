import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { TabsTitle } from "../common/styled";
import InfluenceImpl from "./influenceImpl";

export default function Influence() {
  return (
    <>
      <TabsTitle className="mx-6">Influence</TabsTitle>
      <SecondaryCard className="flex flex-col gap-y-4">
        <InfluenceImpl />
      </SecondaryCard>
    </>
  );
}
