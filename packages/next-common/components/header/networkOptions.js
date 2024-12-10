import MenuGroups from "../../utils/consts/settings/menuGroups";
import NetworkOptionGroup from "./networkOptionGroup";

export default function NetworkOptions({ activeNode, setShow }) {
  return (
    <>
      <NetworkOptionGroup
        groupName={MenuGroups.PolkadotAndParachains}
        activeNode={activeNode}
        setShow={setShow}
      />
      <NetworkOptionGroup
        groupName={MenuGroups.KusamaAndParachains}
        activeNode={activeNode}
        setShow={setShow}
      />
      <NetworkOptionGroup
        groupName={MenuGroups.WestendAndParachains}
        activeNode={activeNode}
        setShow={setShow}
      />
      <NetworkOptionGroup
        groupName={MenuGroups.Solochain}
        activeNode={activeNode}
        setShow={setShow}
      />
      <NetworkOptionGroup
        groupName={MenuGroups.Testnet}
        activeNode={activeNode}
        setShow={setShow}
      />
    </>
  );
}
