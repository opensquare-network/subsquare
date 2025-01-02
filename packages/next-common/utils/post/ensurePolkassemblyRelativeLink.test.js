/* eslint-disable quotes */
import { describe, expect, it } from "vitest";
import { ensurePolkassemblyRelativeLinkUrl } from "./ensurePolkassemblyRelativeLink";

describe("transform polkassembly relative link", () => {
  it("no href attr, replace nothing", () => {
    expect(
      ensurePolkassemblyRelativeLinkUrl(
        '<a class="pa-link">link</a>',
        "polkadot",
      ),
    ).toBe('<a class="pa-link">link</a>');
  });

  it("relative post", () => {
    // double quotes
    expect(
      ensurePolkassemblyRelativeLinkUrl(
        '<a class="pa-link" href="../post/2592" target="_blank">link</a>',
        "polkadot",
      ),
    ).toBe(
      '<a class="pa-link" href="https://polkadot.polkassembly.io/post/2592" target="_blank">link</a>',
    );

    // single quotes
    expect(
      ensurePolkassemblyRelativeLinkUrl(
        "<a href='../post/2592'>link</a>",
        "polkadot",
      ),
    ).toBe("<a href='https://polkadot.polkassembly.io/post/2592'>link</a>");
  });

  it("relative referenda", () => {
    expect(
      ensurePolkassemblyRelativeLinkUrl(
        '<a href="../referenda/1357">link</a>',
        "polkadot",
      ),
    ).toBe(
      '<a href="https://polkadot.polkassembly.io/referenda/1357">link</a>',
    );
  });
});
