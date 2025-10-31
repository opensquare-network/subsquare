import { cn } from "next-common/utils";
import { injectSvgHtml, injectIconNames } from "./config";
import { IS_DEVELOPMENT } from "next-common/utils/constants";

export function InjectIconTemplate() {
  return (
    <svg
      className="absolute w-0 h-0 opacity-0 pointer-events-none"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: injectSvgHtml }}
    ></svg>
  );
}

export default function InjectIcon({ name, className }) {
  if (!injectIconNames.includes(name)) {
    if (IS_DEVELOPMENT) {
      console.error(
        `Icon "${name}" is not defined. Available icons: ${injectIconNames.join(
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
  return <InjectIcon name="asset-icon-bnc" className={className} />;
}
