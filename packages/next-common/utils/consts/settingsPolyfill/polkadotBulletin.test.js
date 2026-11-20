import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Loadable from "next/dist/shared/lib/loadable.shared-runtime";
import ProjectIconPolkadotBulletin from "@osn/icons/subsquare/ProjectIconPolkadotBulletin";
import bulletin from "./polkadotBulletin";

describe("Bulletin chain icon", () => {
  it("renders the Bulletin icon in light and dark modes", async () => {
    await Loadable.preloadAll();

    for (const [Icon, className] of [
      [bulletin.avatar, "logo dark:hidden"],
      [bulletin.darkAvatar, "logo hidden dark:block"],
    ]) {
      expect(renderToStaticMarkup(createElement(Icon, { className }))).toBe(
        renderToStaticMarkup(
          createElement(ProjectIconPolkadotBulletin, { className }),
        ),
      );
    }
  });
});
