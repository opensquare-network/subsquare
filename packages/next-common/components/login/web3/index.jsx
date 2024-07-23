import { noop } from "lodash-es";
import LoginWeb3Substrate from "./substrate";
import { useEffect, useState } from "react";
import LoginWeb3EVM from "./evm";

export default function LoginWeb3({ setIsWeb3 = noop }) {
  const [view, setView] = useState("substrate");

  const isSubstrate = view === "substrate";
  const isEVM = view === "evm";

  useEffect(() => {
    return () => {
      setView("substrate");
    };
  }, []);

  return (
    <div className="space-y-6">
      {isSubstrate && <LoginWeb3Substrate setView={setView} />}

      {isEVM && <LoginWeb3EVM setView={setView} />}

      <div className="text-center text14Medium text-textSecondary">
        Login with{" "}
        <span
          className="text-theme500"
          role="button"
          onClick={() => {
            setIsWeb3(false);
          }}
        >
          Account
        </span>
      </div>
    </div>
  );
}
