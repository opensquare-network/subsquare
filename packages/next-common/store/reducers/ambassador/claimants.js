import { createSlice } from "@reduxjs/toolkit";

const name = "ambassadorSalaryClaimants";

const ambassadorSalaryClaimantsSlice = createSlice({
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
  setClaimants: setAmbassadorSalaryClaimants,
  setLoading: setAmbassadorSalaryClaimantsLoading,
  incTrigger: incAmbassadorSalaryClaimantsTrigger,
} = ambassadorSalaryClaimantsSlice.actions;

export const fetchAmbassadorSalaryClaimants = (api) => {
  return async (dispatch) => {
    try {
      dispatch(setAmbassadorSalaryClaimantsLoading(true));
      const entries = await api.query?.ambassadorSalary?.claimant?.entries?.();
      const members = entries.map(([storageKey, record]) => {
        const address = storageKey.args[0].toString();
        const status = record.toJSON();

        return {
          address,
          status,
        };
      });
      dispatch(setAmbassadorSalaryClaimants(members));
    } finally {
      dispatch(setAmbassadorSalaryClaimantsLoading(false));
    }
  };
};

export const ambassadorSalaryClaimantsSelector = (state) =>
  state[name].claimants;
export const ambassadorSalaryClaimantsTriggerSelector = (state) =>
  state[name].trigger;

export default ambassadorSalaryClaimantsSlice.reducer;
