// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import JsonTreeView from "./index";
import { containerLabel, formatLeaf, getJsonKind } from "./kind";

// The tree atoms are .js files holding JSX, which the test runner cannot parse (only the
// apps' Next build can). Stand in for them, keeping the folded/setFolded contract.
vi.mock("next-common/components/papiCallTreeView/indentPanel", () => ({
  default: ({ children }) => <div>{children}</div>,
}));
vi.mock("next-common/components/papiCallTreeView/foldButton", () => ({
  default: ({ folded, setFolded }) => (
    <button type="button" onClick={() => setFolded(!folded)}>
      {folded ? "expand" : "fold"}
    </button>
  ),
}));

// Copied from Polkadot Asset Hub storage reads, the location shown by the dotUSD page.
// See components/dotusd/psmUtils.test.js.
const dotUsdLocation = {
  parents: 0,
  interior: {
    type: "X2",
    value: [
      { type: "PalletInstance", value: 50 },
      { type: "GeneralIndex", value: 7873 },
    ],
  },
};

async function render(element) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  await act(async () => {
    root.render(element);
  });
  return container;
}

async function click(element) {
  await act(async () => {
    element.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
}

describe("json kinds", () => {
  it("labels containers and scalars", () => {
    expect(getJsonKind(null)).toBe("null");
    expect(getJsonKind(undefined)).toBe("null");
    expect(getJsonKind([])).toBe("array");
    expect(getJsonKind({})).toBe("object");
    expect(getJsonKind("X2")).toBe("string");
    expect(getJsonKind(50)).toBe("number");
    expect(getJsonKind(true)).toBe("boolean");
  });

  it("shows BigInt as a number", () => {
    expect(getJsonKind(7873n)).toBe("number");
    expect(formatLeaf(7873n)).toBe("7873");
  });

  it("renders empty containers and null as text", () => {
    expect(formatLeaf(null)).toBe("null");
    expect(formatLeaf([])).toBe("[]");
    expect(formatLeaf({})).toBe("{}");
    expect(formatLeaf("X2")).toBe("X2");
  });

  it("sizes arrays in the container label", () => {
    expect(containerLabel("array", 2)).toBe("array[2]");
    expect(containerLabel("object", 2)).toBe("object");
  });
});

describe("JsonTreeView", () => {
  it("renders a nested location as a tree", async () => {
    const container = await render(<JsonTreeView src={dotUsdLocation} />);
    const text = container.textContent;

    expect(text).toContain("parents: number");
    expect(text).toContain("0");
    expect(text).toContain("interior: object");
    expect(text).toContain("type: string");
    expect(text).toContain("X2");
    expect(text).toContain("value: array[2]");
    expect(text).toContain("[0]: object");
    expect(text).toContain("PalletInstance");
    expect(text).toContain("GeneralIndex");
    expect(text).toContain("7873");
  });

  it("folds a container when its fold button is clicked", async () => {
    const container = await render(<JsonTreeView src={dotUsdLocation} />);
    // Only `interior` is a container, so it carries the only fold button.
    const [interiorFoldButton] = container.querySelectorAll("button");

    expect(container.textContent).toContain("PalletInstance");

    await click(interiorFoldButton);

    expect(container.textContent).not.toContain("PalletInstance");
    // The folded container itself stays, so it can be unfolded again.
    expect(container.textContent).toContain("interior: object");
  });

  it("renders a scalar root without a name", async () => {
    const container = await render(<JsonTreeView src={null} />);

    expect(container.textContent).toContain("null");
  });

  it("renders an empty root container as text", async () => {
    const container = await render(<JsonTreeView src={[]} />);

    expect(container.textContent).toContain("array");
    expect(container.textContent).toContain("[]");
  });

  it("renders arrays of scalars with their indexes", async () => {
    const container = await render(
      <JsonTreeView src={[1, "two", false, null]} />,
    );
    const text = container.textContent;

    expect(text).toContain("[0]: number");
    expect(text).toContain("[1]: string");
    expect(text).toContain("two");
    expect(text).toContain("[2]: boolean");
    expect(text).toContain("false");
    expect(text).toContain("[3]: null");
  });

  it("renders BigInt values without throwing", async () => {
    const container = await render(
      <JsonTreeView src={{ interior: { value: [{ value: 7873n }] } }} />,
    );

    expect(container.textContent).toContain("7873");
  });
});
