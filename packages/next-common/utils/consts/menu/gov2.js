import Gov2Icon from "../../../assets/imgs/icons/type-gov2.svg";
import Gov2Button from "../../../components/menu/gov2Button";

const gov2Menu = {
  value: "gov2",
  name: "Governance V2",
  pathname: "/gov2",
  icon: <Gov2Icon />,
  itemRender: (icon, name) => <Gov2Button icon={icon} name={name} />,
};

export default gov2Menu;
