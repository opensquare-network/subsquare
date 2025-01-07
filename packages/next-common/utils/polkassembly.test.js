/* eslint-disable quotes */
import { describe, expect, it } from "vitest";
import { ensurePolkassemblyRelativeLink } from "./polkassembly";

describe("ensurePolkassemblyRelativeLink", () => {
  it("no href attr, replace nothing", () => {
    expect(
      ensurePolkassemblyRelativeLink('<a class="pa-link">link</a>', "polkadot"),
    ).toBe('<a class="pa-link">link</a>');
  });

  it("relative post", () => {
    // double quotes
    expect(
      ensurePolkassemblyRelativeLink(
        '<a class="pa-link" href="../post/2592" target="_blank">link</a>',
        "polkadot",
      ),
    ).toBe(
      '<a class="pa-link" href="https://polkadot.polkassembly.io/post/2592" target="_blank">link</a>',
    );

    // single quotes
    expect(
      ensurePolkassemblyRelativeLink(
        "<a href='../post/2592'>link</a>",
        "polkadot",
      ),
    ).toBe("<a href='https://polkadot.polkassembly.io/post/2592'>link</a>");
  });

  it("relative referenda", () => {
    expect(
      ensurePolkassemblyRelativeLink(
        '<a href="../referenda/1357">link</a>',
        "polkadot",
      ),
    ).toBe(
      '<a href="https://polkadot.polkassembly.io/referenda/1357">link</a>',
    );
  });

  it("multi relative links", () => {
    expect(
      ensurePolkassemblyRelativeLink(
        '<a href="../referenda/1357">referenda link</a><a href="../post/1234">post link</a>',
        "polkadot",
      ),
    ).toBe(
      '<a href="https://polkadot.polkassembly.io/referenda/1357">referenda link</a><a href="https://polkadot.polkassembly.io/post/1234">post link</a>',
    );
  });
});
