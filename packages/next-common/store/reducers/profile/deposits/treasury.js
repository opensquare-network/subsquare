import { createSlice } from "@reduxjs/toolkit";

const name = "profileTreasuryDeposits";

const profileTreasuryProposalDepositsSlice = createSlice({
  name,
  initialState: {
    proposalDeposits: null,
    bountyBonds: null,
    bountyCuratorDeposits: null,
    tipDeposits: null,
  },
  reducers: {
    setProposalDeposits(state, { payload }) {
      state.proposalDeposits = payload;
    },
    setBountyBonds(state, { payload }) {
      state.bountyBonds = payload;
    },
    setBountyCuratorDeposits(state, { payload }) {
      state.bountyCuratorDeposits = payload;
    },
    setTipDeposits(state, { payload }) {
      state.tipDeposits = payload;
    },
  },
});

export const {
  setProposalDeposits: setProfileTreasuryProposalDeposits,
  setBountyBonds: setProfileBountyBonds,
  setBountyCuratorDeposits: setProfileBountyCuratorDeposits,
  setTipDeposits: setProfileTipDeposits,
} = profileTreasuryProposalDepositsSlice.actions;

export const profileTreasuryProposalDepositsSelector = (state) =>
  state[name].proposalDeposits;
export const profileTreasuryBountyBondsSelector = (state) =>
  state[name].bountyBonds;
export const profileTreasuryBountyCuratorDepositsSelector = (state) =>
  state[name].bountyCuratorDeposits;
export const profileTreasuryTipDepositsSelector = (state) =>
  state[name].tipDeposits;

export default profileTreasuryProposalDepositsSlice.reducer;
