import nextApi from "next-common/services/nextApi";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";

export function useUploadToIpfs() {
  const [uploading, setUploading] = useState(false);
  const dispatch = useDispatch();

  const upload = useCallback(
    async (file, options) => {
      if (uploading) {
        const message = "Already uploading";
        dispatch(newErrorToast(message));
        return { error: { message } };
      }

      if (!file) {
        const message = "No file to upload";
        dispatch(newErrorToast(message));
        return { error: { message } };
      }

      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file, file.name);

        const response = await nextApi.postFormData("ipfs/files", formData);

        if (response?.error) {
          dispatch(
            newErrorToast(options?.errorMessage || response?.error?.message),
          );
        }

        return response;
      } finally {
        setUploading(false);
      }
    },
    [dispatch, uploading],
  );

  return {
    uploading,
    upload,
  };
}
