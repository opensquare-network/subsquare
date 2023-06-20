import React from "react";
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
    <span>
      {!hideText && <span>{text}</span>}
      <span className="inline-flex ml-2 space-x-2 relative top-1">
        {links.map((link) => {
          let SvgIcon;
          try {
            SvgIcon = getLinkIcon(link);
          } catch (e) {
            SvgIcon = defaultLinkSvg;
          }

          return (
            <Link
              key={link}
              className="inline-flex items-center"
              href={link}
              target="_blank"
            >
              <SvgIcon />
            </Link>
          );
        })}
      </span>
    </span>
  );
}
