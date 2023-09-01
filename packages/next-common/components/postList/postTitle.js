import isNil from "lodash.isnil";
import ReasonLink from "../reasonLink";
import Link from "next/link";

export default function ListPostTitle({ data = {}, href }) {
  let title = data.title?.trim() || "--";

  return (
    <div className="flex-1 overflow-hidden text-textPrimary text16Medium">
      {!isNil(data?.index) && (
        <span className="after:content-['·'] after:mx-2 after:text-textTertiary">{`#${data.index}`}</span>
      )}

      <Link
        href={href}
        className="cursor-pointer hover:underline"
        style={{ wordBreak: "break-word" }}
      >
        {title}
      </Link>
      <ReasonLink text={data.title} hideText={true} />
    </div>
  );
}
