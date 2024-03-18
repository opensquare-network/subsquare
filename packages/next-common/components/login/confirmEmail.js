import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

import nextApi from "../../services/nextApi";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import PrimaryButton from "next-common/lib/button/primary";
import { useLoginPopup } from "next-common/hooks/useLoginPopup";

export default function ConfirmEmail({ pin, email, identity, setErrors }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { closeLoginPopup } = useLoginPopup();

  const submit = async () => {
    try {
      setLoading(true);
      //an identified email address will be bind right after called user/setemail
      if (identity?.info?.email === email && identity?.isAuthorized) {
        await nextApi.post("user/setemail", { email });
        closeLoginPopup();
        return router.replace("/");
      }

      const { result, error } = await nextApi.post("auth/verify", {
        email,
        token: pin,
      });
      if (result) {
        dispatch(
          newSuccessToast(
            "Verification code has been confirmed, you can subscribe for notifications now.",
          ),
        );
        closeLoginPopup();
        router.replace("/");
      } else if (error) {
        setErrors(error);
      }
    } catch (e) {
      dispatch(newErrorToast(e.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PrimaryButton isFill loading={loading} onClick={submit}>
      Confirm
    </PrimaryButton>
  );
}
