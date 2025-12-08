import {
  defaultLinkSvg,
  extractLinks,
  getLinkIcon,
} from "../utils/viewfuncs/tip";
import Link from "next-common/components/link";

export default function ReasonLink({ text, hideText = false }) {
  if (!text) {
    return null;
  }

  const links = extractLinks(text);

  return (
    <span>
      {!hideText && <span>{text}</span>}
      {!!links?.length && (
        <span className="inline-flex ml-2 gap-x-2">
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
                className="relative bottom-0.5 [&_svg]:inline"
                href={link}
                target="_blank"
              >
                {svgIcon}
              </Link>
            );
          })}
        </span>
      )}
    </span>
  );
}
