// @vitest-environment jsdom
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import ReferendaStatusSelectField from "next-common/components/popup/fields/referendaStatusSelectField";
import { renderMentionIdentityUserPlugin } from "./renderMentionIdentityUser";

vi.mock("next-common/utils", () => ({ cn: () => "" }));
vi.mock("@osn/icons/subsquare", () => ({ ArrowDown: () => null }));

let container;
let root;

beforeEach(() => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(async () => {
  vi.restoreAllMocks();
  await act(() => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
});

it.each(["a", "span"])(
  "renders a %s identity mention when replaceWith is unavailable",
  async (tag) => {
    const mention = document.createElement(tag);
    mention.setAttribute("osn-polka-address", "wallet");
    mention.setAttribute("osn-polka-network", "hydradx");
    mention.textContent = "address";
    Object.defineProperty(mention, "replaceWith", { value: undefined });
    container.appendChild(mention);

    function Identity({ address, network }) {
      return <span>{`${network}/${address}`}</span>;
    }

    const plugin = renderMentionIdentityUserPlugin(<Identity />, {
      targetElement: { tag },
    });
    await act(() => plugin.onRenderedHtml(container));

    expect(mention.isConnected).toBe(false);
    expect(
      container.querySelector(".mention-identity-user-app").textContent,
    ).toBe("hydradx/wallet");
  },
);

it("changes the referendum status without a native select value descriptor", async () => {
  const getDescriptor = Object.getOwnPropertyDescriptor;
  vi.spyOn(Object, "getOwnPropertyDescriptor").mockImplementation(
    (target, key) => {
      if (target === window.HTMLSelectElement.prototype && key === "value") {
        return undefined;
      }
      return getDescriptor(target, key);
    },
  );

  const onChange = vi.fn();
  await act(() =>
    root.render(<ReferendaStatusSelectField onChange={onChange} />),
  );
  const trigger = container.querySelector("button");
  expect(trigger.textContent).toBe("All status");
  await act(() => {
    trigger.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    );
  });

  const approved = [...document.querySelectorAll("[role=menuitemradio]")].find(
    (item) => item.textContent === "Approved",
  );
  expect(approved).toBeDefined();
  await act(() => approved.click());
  expect(onChange).toHaveBeenCalledWith("Approved");
  expect(container.querySelector("select")).toBeNull();
});
