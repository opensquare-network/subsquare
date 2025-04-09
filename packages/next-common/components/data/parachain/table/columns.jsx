import {
  ArrowRight,
  LinkGithub,
  LinkWebsite,
  LinkTwitter,
  LinkDiscord,
} from "@osn/icons/subsquare";
import ParaChainDefaultIcon from "next-common/assets/icons/chain/parachain-default.svg";
import parachainConfig from "next-common/utils/parachainConfig";
import ExternalLink from "next-common/components/externalLink";

const NameColumn = ({ info }) => {
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
          <ParaChainDefaultIcon className="w-5 h-5" />
        )}
      </div>
      <span className="text14Medium">{info?.text || "Unknown"}</span>
    </div>
  );
};

const iconMap = {
  website: LinkWebsite,
  github: LinkGithub,
  twitter: LinkTwitter,
  discord: LinkDiscord,
};

const LinksColumn = ({ id }) => {
  const { externalLink } = parachainConfig[id] || {};
  return (
    <>
      <div className="flex items-center  justify-between">
        <div className="w-[240px] flex items-center  gap-3 text-textTertiary">
          {externalLink.map(({ type, link }) => {
            const Icon = iconMap[type];
            return (
              <ExternalLink
                key={type}
                href={link}
                title={link}
                className="[&_path]:fill-textTertiary [&_path]:hover:fill-textSecondary"
                externalIcon={false}
              >
                {Icon && <Icon className="w-5 h-5" />}
              </ExternalLink>
            );
          })}
        </div>
      </div>
    </>
  );
};

export const MobileTable = ({ tableData }) => {
  return (
    <div>
      {tableData.map(({ info, id }) => {
        const { ui = {} } = info;
        const { subsquareLink, externalLink } = parachainConfig[id] || {};
        return (
          <div key={id} className="py-4 border-b border-b-neutral300">
            <div className="flex justify-between pb-3">
              <div className="flex items-center gap-x-2">
                <div
                  className="w-6 h-6 flex justify-center items-center rounded-full overflow-hidden "
                  style={ui.color && { backgroundColor: ui.color }}
                >
                  {ui?.logo?.startsWith("data:") ? (
                    <img width={24} src={ui.logo} alt={ui.identityIcon} />
                  ) : (
                    <ParaChainDefaultIcon />
                  )}
                </div>
                <span className="text16Medium">{info?.text || "Unknown"}</span>
              </div>
              <div>
                {subsquareLink ? (
                  <a
                    href={subsquareLink}
                    target="_blank"
                    className="w-7 h-7 flex justify-center items-center border border-neutral400 rounded  text-[#1E2134] cursor-pointer "
                    rel="noreferrer"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </a>
                ) : null}
              </div>
            </div>
            <div className="flex justify-between ">
              <div className="text-textTertiary text14Medium">Para ID</div>
              <div className="textPrimary">{id}</div>
            </div>
            <div className="flex justify-between space-y-1">
              <div className="text-textTertiary text14Medium">
                Related Links
              </div>
              <div className="flex gap-x-3 text-textTertiary">
                {externalLink.map(({ type, link }) => {
                  const Icon = iconMap[type];
                  return (
                    <ExternalLink
                      key={type}
                      href={link}
                      title={link}
                      className="[&_path]:fill-textTertiary [&_path]:hover:fill-textSecondary"
                      externalIcon={false}
                    >
                      {Icon && <Icon className="w-5 h-5" />}
                    </ExternalLink>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const tableColumns = [
  {
    key: "idHuman",
    name: "Para ID",
    className: "text-left",
    style: { width: "120px", minWidth: "120px" },
    render: ({ idHuman }) => idHuman,
  },
  {
    key: "endpoints",
    name: "Name",
    render: NameColumn,
  },
  {
    key: "links",
    name: "Related Links",
    className: "w-[240px]",
    render: LinksColumn,
  },
  {
    key: "id",
    name: "",
    className: "w-[80px]",
    render: ({ id }) => {
      const { subsquareLink } = parachainConfig[id] || {};
      return (
        <div className="flex items-center justify-end">
          {subsquareLink ? (
            <a
              href={subsquareLink}
              target="_blank"
              className={
                "w-7 h-7 border border-[#ebeef4] rounded  text-[#1E2134] cursor-pointer"
              }
              rel="noreferrer"
            >
              <ArrowRight />
            </a>
          ) : null}
        </div>
      );
    },
  },
];
