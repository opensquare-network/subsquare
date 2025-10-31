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

// Convert React components to SVG symbol tags with optimized processing
export default list
  .map((item) => {
    const svgString = ReactDOM.renderToString(<item.icon />);

    // More robust SVG to symbol conversion
    return svgString
      .replace(/<!--[\s\S]*?-->/g, "") // Remove comments
      .replace(/\s+/g, " ") // Normalize whitespace
      .replace(/<svg([^>]*)>/, (_, attributes) => {
        // Extract viewBox if it exists, otherwise use default
        const viewBoxMatch = attributes.match(/viewBox="([^"]*)"/);
        const viewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 24 24";

        return `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" id="${item.name}">`;
      })
      .replace(/<\/svg>$/, "</symbol>")
      .trim();
  })
  .join("\n");
