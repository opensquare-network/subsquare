import { LinkEmail } from "@osn/icons/subsquare";
import { ClosedTag } from "next-common/components/tags/state/styled";
import PrimaryButton from "next-common/lib/button/primary";
import SecondaryButton from "next-common/lib/button/secondary";
import Input from "next-common/lib/input";
import { useState, useEffect } from "react";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";

export default function Email() {
  const [code, setCode] = useState("");
  return (
    <div className="w-full space-y-2 text14Medium text-textPrimary">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <div className="flex text16Bold">
            <LinkEmail />
            <span className="text-textTertiary mx-1 ml-0">·</span>
            <h1>Email</h1>
          </div>
          <div>
            <ClosedTag>Pending</ClosedTag>
          </div>
        </div>
        <SendCode />
      </div>
      <div className="flex gap-4 pb-2">
        <div className="flex items-center ">
          <span className=" text14Bold w-32">Email Address:</span>
          <span className="truncate text-textTertiary">
            pending@example.com
          </span>
        </div>
      </div>
      <div className=" border bg-theme100 text-theme500 rounded-lg p-3">
        <p className=" text12Medium">
          <span className="text12Bold"> Tips:</span> We&lsquo;ve send a 6-digit
          code to your email. Code expires in 10 minutes.
        </p>
      </div>
      <div>
        <label className=" text14Bold mb-2 block">
          Enter Verification Code
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            className="w-full"
            placeholder="Enter 6-digit code"
            onChange={(e) => setCode(e.target.value)}
          />
          <VerifyButton code={code} />
        </div>
      </div>
    </div>
  );
}

function VerifyButton({ code }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const verifyCode = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      dispatch(newSuccessToast("Verify code successfully"));
    }, 1500);
  };
  return (
    <PrimaryButton onClick={verifyCode} loading={loading} disabled={!code}>
      Verify
    </PrimaryButton>
  );
}

function SendCode() {
  const dispatch = useDispatch();
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const sendCode = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      dispatch(newSuccessToast("Send email successfully"));
      setCountdown(60);
    }, 1500);
  };
  return (
    <SecondaryButton
      loading={loading}
      onClick={sendCode}
      disabled={!!countdown}
      size="small"
    >
      Send Code {countdown ? ` ${countdown} s` : ""}
    </SecondaryButton>
  );
}
