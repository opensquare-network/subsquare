import { createSlice } from "@reduxjs/toolkit";

const name = "editor";

const editorSlice = createSlice({
  name,
  initialState: {
    uploading: false,
  },
  reducers: {
    setEditorUploading(state, { payload }) {
      state.uploading = payload;
    },
  },
});

export const { setEditorUploading } = editorSlice.actions;

export const editorUploadingSelector = (state) => state[name].uploading;

export default editorSlice.reducer;
