import ReactDOM from "react-dom/server";
import { AssetIconBnc } from "@osn/icons/subsquare";

/**
 * Icon configuration list
 * To add a new icon, simply add a new item to this array
 */
const list = [
  {
    icon: AssetIconBnc,
    name: "asset-icon-bnc",
  },
];

// Export available icon names list for type checking and validation
export const nameList = list.map(({ name }) => name);

// Convert React components to SVG symbol tags
export default list
  .map((item) => {
    return ReactDOM.renderToString(<item.icon />)
      .replace(
        /<svg([^>]*)>/,
        `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="${item.name}">`,
      )
      .replace(/<\/svg>$/, "</symbol>");
  })
  .join("\n");
