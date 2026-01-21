import Link from "next-common/components/link";
import IdentityIcon from "next-common/components/Identity/identityIcon";
import useIdentityInfo from "next-common/hooks/useIdentityInfo";
import { FellowshipTagByRank } from "next-common/components/profile/fellowshipTagInfo";
import AddressAvatar from "next-common/components/user/addressAvatar";

export function handleLinkClick(e, onClose) {
  e.stopPropagation();
  if (e.metaKey || e.ctrlKey) {
    return;
  }
  onClose?.();
}

export default function CommonSearchItem({
  IconComponent,
  href,
  title,
  content,
  onClose,
}) {
  return (
    <Link
      href={href}
      className="cursor-pointer"
      onClick={(e) => {
        handleLinkClick(e, onClose);
      }}
    >
      <CommonSearchItemContent
        IconComponent={IconComponent}
        title={title}
        content={content}
      />
    </Link>
  );
}

export function CommonSearchItemContent({ IconComponent, title, content }) {
  return (
    <div
      className={`border-0! flex  hover:bg-neutral200 px-2 py-2 rounded-[6px] ${
        content === "-" ? "h-[40px] items-center" : "h-[60px]"
      }`}
    >
      <div>
        <IconComponent className="w-6 h-6 [&_path]:fill-textTertiary" />
      </div>
      <div className="pl-2 flex flex-col justify-between min-w-0 flex-1">
        <span
          className="text14Medium text-textPrimary"
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </span>
        {content !== "-" && (
          <span
            className="text12Medium text-textTertiary"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {content}
          </span>
        )}
      </div>
    </div>
  );
}

export function IdentitySearchItem({ address, name, onClose }) {
  const { identity, hasIdentity } = useIdentityInfo(address);

  const title = hasIdentity ? (
    <span className="flex items-center gap-1">
      <IdentityIcon identity={identity} />
      {name}
    </span>
  ) : (
    <span>{name}</span>
  );

  return (
    <CommonSearchItem
      IconComponent={() => <AddressAvatar address={address} />}
      title={title}
      content={address}
      href={`/user/${address}`}
      onClose={onClose}
    />
  );
}

export function MemberSearchItem({ address, rank, name, onClose }) {
  const { identity, hasIdentity } = useIdentityInfo(address);

  const title = (
    <span className="flex items-center gap-2">
      <span className="flex items-center gap-1">
        {hasIdentity && <IdentityIcon identity={identity} />}
        {name}
      </span>
      <FellowshipTagByRank rank={rank} type="fellowship" />
    </span>
  );

  return (
    <CommonSearchItem
      IconComponent={() => <AddressAvatar address={address} />}
      title={title}
      content={address}
      href={`/user/${address}`}
      onClose={onClose}
    />
  );
}
