import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { TabsTitle } from "../common/styled";
import InfluenceImpl from "./influenceImpl";
import WindowSizeProvider from "next-common/context/windowSize";

export default function Influence() {
  return (
    <WindowSizeProvider>
      <TabsTitle className="mx-6">Influence</TabsTitle>
      <SecondaryCard>
        <InfluenceImpl />
      </SecondaryCard>
    </WindowSizeProvider>
  );
}
