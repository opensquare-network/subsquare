import { createSlice } from "@reduxjs/toolkit";

const myProxiesSlice = createSlice({
  name: "myProxies",
  initialState: {
    proxies: null,
    loading: true,
    total: 0,
  },
  reducers: {
    setProxies(state, { payload }) {
      state.proxies = payload;
    },
    setTotal(state, { payload }) {
      state.total = payload;
    },
    setLoading(state, { payload }) {
      state.loading = payload;
    },
  },
});

export const myProxiesSelector = (state) => state.myProxies;

export const { setProxies, setTotal, setLoading } = myProxiesSlice.actions;

export default myProxiesSlice.reducer;

export const fetchMyProxies = (address, api) => async (dispatch) => {
  if (!address || !api) {
    return;
  }

  api.query.proxy.proxies(address).then((result) => {
    const proxies = result?.toJSON();
    const total = proxies[0]?.length || 0;

    dispatch(setProxies(proxies[0]));
    dispatch(setTotal(total));
    dispatch(setLoading(false));
  });
};

export const clearMyProxies = () => async (dispatch) => {
  dispatch(setProxies(null));
  dispatch(setTotal(0));
  dispatch(setLoading(false));
};
