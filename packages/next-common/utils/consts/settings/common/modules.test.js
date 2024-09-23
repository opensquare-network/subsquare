import { describe, expect, it } from "vitest";
import getChainSettings from "..";

describe("polkadot", () => {
  const { modules } = getChainSettings("polkadot");

  it("referenda true", () => {
    expect(modules.referenda).toBe(true);
  });

  it("democracy false", () => {
    expect(modules.democracy).toBe(false);
  });

  it("treasury", () => {
    expect(modules.treasury).toBeTruthy();
  });
  it("treasury spends true", () => {
    expect(modules.treasury.spends).toBe(true);
  });
  it("treasury bounties true", () => {
    expect(modules.treasury.bounties).toBe(true);
  });
  it("treasury childBounties true", () => {
    expect(modules.treasury.childBounties).toBe(true);
  });
  it("treasury tips false", () => {
    expect(modules.treasury.tips).toBe(false);
  });

  it("council false", () => {
    expect(modules.council).toBe(false);
  });

  it("technicalCommittee false", () => {
    expect(modules.technicalCommittee).toBe(false);
  });
});

describe("kusama", () => {
  const { modules } = getChainSettings("kusama");

  it("referenda true", () => {
    expect(modules.referenda).toBe(true);
  });

  it("democracy false", () => {
    expect(modules.democracy).toBe(false);
  });

  it("treasury", () => {
    expect(modules.treasury).toBeTruthy();
  });
  it("treasury spends false", () => {
    expect(modules.treasury.spends).toBe(false);
  });
  it("treasury bounties true", () => {
    expect(modules.treasury.bounties).toBe(true);
  });
  it("treasury childBounties true", () => {
    expect(modules.treasury.childBounties).toBe(true);
  });
  it("treasury tips false", () => {
    expect(modules.treasury.tips).toBe(false);
  });
});

describe("collectives", () => {
  const { modules } = getChainSettings("collectives");

  it("fellowship truthy", () => {
    expect(modules.fellowship).toBeTruthy();
  });
  it("fellowship core true", () => {
    expect(modules.fellowship.core).toBe(true);
  });
  it("fellowship treasury true", () => {
    expect(modules.fellowshipTreasury).toBe(true);
  });

  it("ambassador true", () => {
    expect(modules.ambassador).toBe(true);
  });

  it("democracy false", () => {
    expect(modules.democracy).toBe(false);
  });

  it("council false", () => {
    expect(modules.council).toBe(false);
  });

  it("technicalCommittee false", () => {
    expect(modules.technicalCommittee).toBe(false);
  });

  it("alliance true", () => {
    expect(modules.alliance).toBe(true);
  });
});

describe("astar", () => {
  const { modules } = getChainSettings("astar");

  it("referenda false", () => {
    expect(modules.referenda).toBe(false);
  });

  it("democracy truthy", () => {
    expect(modules.democracy).toBeTruthy();
  });

  it("treasury truthy", () => {
    expect(modules.treasury).toBeTruthy();
  });
  it("treasury proposals true", () => {
    expect(modules.treasury.proposals).toBe(true);
  });
  it("treasury bounties false", () => {
    expect(modules.treasury.bounties).toBe(false);
  });
  it("treasury childBounties false", () => {
    expect(modules.treasury.childBounties).toBe(false);
  });
  it("treasury tips false", () => {
    expect(modules.treasury.tips).toBe(false);
  });

  it("communityCouncil true", () => {
    expect(modules.communityCouncil).toBe(true);
  });

  it("communityTreasury true", () => {
    expect(modules.communityTreasury).toBe(true);
  });

  it("technicalCommittee true", () => {
    expect(modules.technicalCommittee).toBe(true);
  });
});

describe("hydration", () => {
  const { modules } = getChainSettings("hydradx");

  it("referenda false", () => {
    expect(modules.referenda).toBe(false);
  });

  it("democracy truthy", () => {
    expect(modules.democracy).toBeTruthy();
  });

  it("treasury truthy", () => {
    expect(modules.treasury).toBeTruthy();
  });
  it("treasury proposals true", () => {
    expect(modules.treasury.proposals).toBe(true);
  });
  it("treasury bounties false", () => {
    expect(modules.treasury.bounties).toBe(false);
  });
  it("treasury childBounties false", () => {
    expect(modules.treasury.childBounties).toBe(false);
  });
  it("treasury tips true", () => {
    expect(modules.treasury.tips).toBe(true);
  });

  it("communityCouncil false", () => {
    expect(modules.communityCouncil).toBe(false);
  });

  it("communityTreasury false", () => {
    expect(modules.communityTreasury).toBe(false);
  });

  it("technicalCommittee truthy", () => {
    expect(modules.technicalCommittee).toBeTruthy();
  });
});

describe("interlay", () => {
  const { modules } = getChainSettings("interlay");

  it("referenda false", () => {
    expect(modules.referenda).toBe(false);
  });

  it("democracy truthy", () => {
    expect(modules.democracy).toBeTruthy();
  });

  it("democracy externalProposals false", () => {
    expect(modules.democracy.externalProposals).toBe(false);
  });

  it("treasury truthy", () => {
    expect(modules.treasury).toBeTruthy();
  });
  it("treasury bounties false", () => {
    expect(modules.treasury.bounties).toBe(false);
  });
  it("treasury childBounties false", () => {
    expect(modules.treasury.childBounties).toBe(false);
  });
  it("treasury tips false", () => {
    expect(modules.treasury.tips).toBe(false);
  });

  it("council false", () => {
    expect(modules.council).toBe(false);
  });

  it("technicalCommittee truthy", () => {
    expect(modules.technicalCommittee).toBeTruthy();
  });

  it("preimages true", () => {
    expect(modules.preimages).toBe(true);
  });
});
