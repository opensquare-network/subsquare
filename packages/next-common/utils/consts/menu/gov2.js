import Gov2Icon from "../../../assets/imgs/icons/type-gov2.svg";
import TrackAllIcon from "../../../assets/imgs/icons/track-all.svg";
import BackIcon from "../../../assets/imgs/icons/back.svg";
import Gov2Button from "../../../components/menu/gov2Button";

// for v1 entry
const gov2EntryItem = {
  value: "gov2",
  name: "Governance V2",
  pathname: "/gov2",
  icon: <Gov2Icon />,
  itemRender: (icon, name) => <Gov2Button icon={icon} name={name} />,
};

const back = {
  items: [
    {
      value: "gov1",
      name: "Back to Gov1",
      pathname: "/",
      icon: <BackIcon />,
    },
  ],
};

const gov2Menus = [
  back,
  {
    name: "REFERENDA",
    items: [
      {
        value: "all",
        name: "All",
        pathname: "/gov2",
        icon: <TrackAllIcon />,
      },
    ],
  },
];
export { gov2EntryItem, gov2Menus };
