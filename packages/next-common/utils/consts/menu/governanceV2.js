import Gov2Icon from "../../../assets/imgs/icons/type-gov2.svg";
import GovernanceV2Button from "../../../components/menu/governanceV2Button";

const governanceV2Menu = {
  value: "gov2",
  name: "Governance V2",
  pathname: "/gov2",
  icon: <Gov2Icon />,
  itemRender: (icon, name) => <GovernanceV2Button icon={icon} name={name} />,
};

export default governanceV2Menu;
