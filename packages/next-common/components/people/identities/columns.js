import AddressUser from "next-common/components/user/addressUser";
import MailLink from "next-common/components/links/mailLink";
import WebLink from "next-common/components/links/webLink";
import ElementLink from "next-common/components/links/elementLink";
import TwitterLink from "next-common/components/links/twitterLink";

function Socials({ info }) {
  const email = info?.email?.Raw;
  const twitter = info?.twitter?.Raw;
  const web = info?.web?.Raw;
  const matrix = info?.matrix?.Raw;
  return (
    <div className="flex gap-1">
      {email && <MailLink email={email} />}
      {web && <WebLink website={web} />}
      {matrix && <ElementLink riot={matrix} />}
      {twitter && <TwitterLink twitter={twitter} />}
    </div>
  );
}

export const desktopColumns = [
  {
    name: "Proxies",
    className: "text-left",
    render: (item) => (
      <AddressUser key={`account-${item.address}`} add={item.address} />
    ),
  },
  {
    name: "Socials",
    width: 140,
    render: (item) => <Socials info={item.info} />,
  },
  {
    name: "Sub Identities",
    width: 160,
    render: (item) =>
      item.subIdentities ? (
        <div
          key={`subsCount-${item.address}`}
          className="text-textPrimary text14Medium"
        >
          {item.subIdentities.length}
        </div>
      ) : null,
  },
];

export const mobileColumns = [
  {
    name: "Proxies",
    className: "text-left",
    render: (item) => (
      <div className="space-y-2 w-full">
        <div className="flex justify-between">
          <AddressUser key={`account-${item.address}`} add={item.address} />
          {item.subIdentities ? (
            <div
              key={`subsCount-${item.address}`}
              className="text-textPrimary text14Medium"
            >
              {item.subIdentities.length}
            </div>
          ) : null}
        </div>
        <div className="">
          <Socials info={item.info} />
        </div>
      </div>
    ),
  },
];
