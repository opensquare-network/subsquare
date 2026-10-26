import { describe, expect, it } from "vitest";
import { getDotnsNameNode, stripTld } from "./utils";

// Values read from the dotNS protocol registry and registrar on Polkadot
const tldNode =
  "0x3fce7d1364a893e213bc4212792b517ffc88f5b13b86c8ef9c8d390c3a1370ce";

describe("services/dotns/utils", () => {
  it("computes the second level node of a dotNS name", () => {
    expect(getDotnsNameNode(tldNode, "contracts")).toBe(
      "0x6bb24220385f5fda609e3b0b6b5bf15961651023cc6ad711ac0ad977ada8a7db",
    );
    expect(getDotnsNameNode(tldNode, "icebergnodes")).toBe(
      "0x44f5bb9c3915bc7bfb40bb1a5ccb1df8dd2226ef782ef25f95620f2f269b684d",
    );
  });

  it("strips the tld from a stored label", () => {
    expect(stripTld("contracts.dot", ".dot")).toBe("contracts");
    expect(stripTld("Contracts.DOT", ".dot")).toBe("Contracts");
    expect(stripTld("contracts", ".dot")).toBe("contracts");
    expect(stripTld("contracts.dot", "")).toBe("contracts.dot");
  });
});
