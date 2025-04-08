import { ArrowRight } from "@osn/icons/subsquare";
import ParaChainDefaultIcon from "next-common/assets/icons/chain/parachain-default.svg";

const parachainIdColumn = {
  key: "id",
  name: "Para ID",
  className: "text-left",
  style: { width: "250px", minWidth: "250px" },
  render: ({ id }) => id,
};

const chainNameColumn = {
  key: "endpoints",
  name: "Name",
  render: ({ endpoints, info }) => <Item info={info} endpoints={endpoints} />,
};

const chainLinkColumn = {
  key: "links",
  name: "Related Links",
  className: "w-[200px]",
  render: ({ info }) => (
    <>
      <div className="flex items-center  justify-between">
        <div className="w-[40px]"></div>
        <a
          href={info?.homepage}
          target="_blank"
          className={` w-7 h-7 border border-[#ebeef4] rounded ${
            !info?.homepage
              ? "text-[#C2C8D4] cursor-not-allowed "
              : "text-[#1E2134] cursor-pointer"
          }`}
          rel="noreferrer"
        >
          <ArrowRight />
        </a>
      </div>
    </>
  ),
};

const Item = ({ info }) => {
  const { ui = {} } = info;

  return (
    <div className="flex items-center gap-x-2">
      <div
        className="w-5 h-5 rounded-full overflow-hidden "
        style={ui.color && { backgroundColor: ui.color }}
      >
        {ui?.logo?.startsWith("data:") ? (
          <img src={ui.logo} alt={ui.identityIcon} />
        ) : (
          <ParaChainDefaultIcon className="W-5 H-5" />
        )}
      </div>
      <span className="text14Medium">{info?.text || "Unknown"}</span>
    </div>
  );
};

export const desktopColumns = [
  parachainIdColumn,
  chainNameColumn,
  chainLinkColumn,
];

export const mobileColumns = [
  parachainIdColumn,
  chainNameColumn,
  chainLinkColumn,
];
