import { noop } from "lodash-es";
import ErrorText from "next-common/components/ErrorText";
import {
  fetchAndUpdateUserStatus,
  useSetUser,
  useUserContext,
} from "next-common/context/user";
import { useLoginPopup } from "next-common/hooks/useLoginPopup";
import PrimaryButton from "next-common/lib/button/primary";
import SecondaryButton from "next-common/lib/button/secondary";
import nextApi from "next-common/services/nextApi";
import {
  LoginResult,
  setLoginResult,
} from "next-common/store/reducers/userSlice";
import useForm from "next-common/utils/hooks/useForm";
import Link from "next/link";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useAsyncFn } from "react-use";
import Password from "./password";
import Username from "./username";

export default function LoginAccount({ setIsWeb3 = noop }) {
  const setUser = useSetUser();
  const userContext = useUserContext();
  const dispatch = useDispatch();
  const { closeLoginPopup } = useLoginPopup();
  const [error, setError] = useState();

  const [state, submit] = useAsyncFn(async (formData) => {
    const resp = await nextApi.post("auth/login", formData);

    if (resp.result) {
      setUser(resp.result);
      await fetchAndUpdateUserStatus(userContext);
      dispatch(setLoginResult(LoginResult.LoggedIn));
      closeLoginPopup();
    } else if (resp.error) {
      setError(resp.error);
      throw new Error(resp.error);
    }
  });

  const { formData, handleInputChange, handleSubmit } = useForm(
    {
      usernameOrEmail: "",
      password: "",
    },
    submit,
  );
  const { usernameOrEmail, password } = formData;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        <Username
          value={usernameOrEmail}
          onChange={handleInputChange}
          error={error?.data?.usernameOrEmail}
        />
        <Password
          value={password}
          onChange={handleInputChange}
          error={error?.data?.password}
        />

        {error?.message && !error?.data && (
          <ErrorText>{error?.message}</ErrorText>
        )}

        <div className="mt-2 text-textTertiary text12Medium">
          <Link href={"/forget"}>Forget password?</Link>
        </div>

        <div className="space-y-3 mt-6">
          <PrimaryButton
            className="w-full"
            loading={state.loading}
            type="submit"
          >
            Login
          </PrimaryButton>
          <SecondaryButton
            className="w-full"
            onClick={(event) => {
              event.preventDefault();
              setIsWeb3(true);
            }}
          >
            Connect with wallet
          </SecondaryButton>
        </div>
      </form>
      <div className="text-center text14Medium text-textSecondary">
        {"Don't have an account? "}
        <Link href={"/signup"} className="text-theme500">
          Sign up
        </Link>
      </div>
    </div>
  );
}
