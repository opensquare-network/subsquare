import AddressUser from "next-common/components/user/addressUser";
import {
  LinkEmail,
  LinkTwitter,
  LinkWebsite,
  LinkElement,
} from "@osn/icons/subsquare";
import Link from "next-common/components/link";

function Socials({ info }) {
  const email = info?.email?.Raw;
  const twitter = info?.twitter?.Raw;
  const web = info?.web?.Raw;
  const matrix = info?.matrix?.Raw;
  return (
    <div className="flex gap-1">
      {email && (
        <Link href={`mailto:${email}`}>
          <LinkEmail className="text-textSecondary hover:text-textPrimary w-4 h-4 md:w-5 md:h-5" />
        </Link>
      )}
      {twitter && (
        <Link target="_blank" href={`https://x.com/${twitter}`}>
          <LinkTwitter className="text-textSecondary hover:text-textPrimary w-4 h-4 md:w-5 md:h-5" />
        </Link>
      )}
      {web && (
        <Link href={web}>
          <LinkWebsite className="text-textSecondary hover:text-textPrimary w-4 h-4 md:w-5 md:h-5" />
        </Link>
      )}
      {matrix && (
        <Link href={`https://matrix.to/#/${matrix}`}>
          <LinkElement className="text-textSecondary hover:text-textPrimary w-4 h-4 md:w-5 md:h-5" />
        </Link>
      )}
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
