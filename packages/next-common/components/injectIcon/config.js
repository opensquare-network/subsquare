import ReactDOM from "react-dom/server";
import { AssetIconBnc } from "@osn/icons/subsquare";

const iconList = [
  {
    icon: AssetIconBnc,
    name: "asset-icon-bnc",
  },
];

export const injectIconNames = iconList.map(({ name }) => name);

export const injectSvgHtml = iconList
  .map((item) => {
    const svgString = ReactDOM.renderToString(<item.icon />);

    return svgString
      .replace(/<!--[\s\S]*?-->/g, "") // Remove comments
      .replace(/\s+/g, " ") // Normalize whitespace
      .replace(/<svg([^>]*)>/, (_, attributes) => {
        const viewBoxMatch = attributes.match(/viewBox="([^"]*)"/);
        const viewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 24 24";
        return `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" id="${item.name}">`;
      })
      .replace(/<\/svg>$/, "</symbol>")
      .trim();
  })
  .join("\n");
