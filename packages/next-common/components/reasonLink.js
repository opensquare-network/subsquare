import {
  defaultLinkSvg,
  extractLinks,
  getLinkIcon,
} from "../utils/viewfuncs/tip";
import Link from "next/link";

export default function ReasonLink({ text, hideText = false }) {
  if (!text) {
    return null;
  }

  const links = extractLinks(text);

  return (
    <div className="flex items-center">
      {!hideText && <span>{text}</span>}
      {!!links?.length && (
        <span className="inline-flex ml-2 space-x-2">
          {links.map((link) => {
            let svgIcon;
            try {
              svgIcon = getLinkIcon(link);
            } catch (e) {
              svgIcon = defaultLinkSvg;
            }

            return (
              <Link
                key={link}
                className="inline-flex items-center"
                href={link}
                target="_blank"
              >
                {svgIcon}
              </Link>
            );
          })}
        </span>
      )}
    </div>
  );
}
