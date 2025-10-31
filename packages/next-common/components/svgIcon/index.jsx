import { cn } from "next-common/utils";
import svgHtml, { nameList } from "./config";

/**
 * SVG Icon Template Component - Injects all icon definitions into the page
 * This component should be rendered only once at the page root
 */
export function IconTemplate() {
  return (
    <svg
      className="absolute w-0 h-0 opacity-0 pointer-events-none"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svgHtml }}
    ></svg>
  );
}

/**
 * Icon Component
 * @param {Object} props - Component props
 * @param {string} props.name - Icon name, must be one of the names defined in config.js
 * @param {string} [props.className] - CSS class name
 * @returns {JSX.Element|null} SVG icon element
 */
export default function Icon({ name, className }) {
  if (!nameList.includes(name)) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        `Icon "${name}" is not defined. Available icons: ${nameList.join(
          ", ",
        )}`,
      );
    }
    return null;
  }

  return (
    <svg className={cn("w-4 h-4", className)} aria-hidden="true">
      <use xlinkHref={`#${name}`} />
    </svg>
  );
}

export function AssetIconBnc({ className }) {
  return <Icon name="asset-icon-bnc" className={className} />;
}
