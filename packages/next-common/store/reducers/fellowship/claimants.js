import { createSlice } from "@reduxjs/toolkit";

const name = "fellowshipSalaryClaimants";

const fellowshipSalaryClaimantsSlice = createSlice({
  name,
  initialState: {
    claimants: null,
    isLoading: false,
    trigger: 0,
  },
  reducers: {
    setClaimants(state, { payload }) {
      state.claimants = payload;
    },
    setLoading(state, { payload }) {
      state.isLoading = payload;
    },
    incTrigger(state) {
      state.trigger = state.trigger + 1;
    },
  },
});

export const {
  setClaimants: setFellowshipSalaryClaimants,
  setLoading: setFellowshipSalaryClaimantsLoading,
  incTrigger: incFellowshipSalaryClaimantsTrigger,
} = fellowshipSalaryClaimantsSlice.actions;

export const fetchFellowshipSalaryClaimants = (api) => {
  return async (dispatch) => {
    try {
      dispatch(setFellowshipSalaryClaimantsLoading(true));
      const entries = await api.query?.fellowshipSalary?.claimant?.entries?.();
      const members = entries.map(([storageKey, record]) => {
        const address = storageKey.args[0].toString();
        const status = record.toJSON();

        return {
          address,
          status,
        };
      });
      dispatch(setFellowshipSalaryClaimants(members));
    } finally {
      dispatch(setFellowshipSalaryClaimantsLoading(false));
    }
  };
};

export const fellowshipSalaryClaimantsSelector = (state) =>
  state[name].claimants;
export const fellowshipSalaryClaimantsTriggerSelector = (state) =>
  state[name].trigger;

export default fellowshipSalaryClaimantsSlice.reducer;
