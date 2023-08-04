import nextApi from "next-common/services/nextApi";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";

export function useUploadToIpfs() {
  const [uploading, setUploading] = useState(false);
  const dispatch = useDispatch();

  async function upload(files) {
    if (uploading) {
      return;
    }

    if (files && files.length) {
      const image = files[0];
      if (!/image\/\w+/.exec(image.type)) {
        return;
      }

      setUploading(true);

      const formData = new FormData();
      formData.append("file", image, image.name);

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
