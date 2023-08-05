import nextApi from "next-common/services/nextApi";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";

export function useUploadToIpfs() {
  const [uploading, setUploading] = useState(false);
  const dispatch = useDispatch();

  async function upload(file) {
    if (uploading) {
      return;
    }

    if (file) {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file, file.name);

      return nextApi
        .postFormData("ipfs/files", formData)
        .then((response) => {
          if (response?.error) {
            dispatch(newErrorToast(response?.error?.message));
          }

          return response;
        })
        .finally(() => {
          setUploading(false);
        });
    }
  }

  return {
    uploading,
    upload,
  };
}
