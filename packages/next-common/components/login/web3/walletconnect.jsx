import { ArrowCircleLeft } from "@osn/icons/subsquare";
import {
  WalletGroupTitle,
  WalletOptionsWrapper,
} from "next-common/components/wallet/options/styled";
import WalletOption from "next-common/components/wallet/walletOption";
import { useWalletConnect } from "next-common/context/walletconnect";
import { useWalletConnectAccounts } from "next-common/hooks/connect/useWalletConnectAccounts";
import { useWeb3Login } from "next-common/hooks/connect/useWeb3Login";
import { useWeb3WalletView } from "next-common/hooks/connect/useWeb3WalletView";
import qrcode from "qrcode";
import { useEffect, useState } from "react";
import { useInterval, useUnmount } from "react-use";

const SIZE = 300;
const REFRESH_QRCODE_INTERVAL = 4 * 60 * 1000; // 4 minutes

function Skeleton() {
  return (
    <div className="w-full h-full rounded-md bg-gradient-to-r from-neutral200 to-neutral200 " />
  );
}

export default function LoginWeb3WalletConnect() {
  const { setView } = useWeb3WalletView();
  const { connect, session } = useWalletConnect();
  const [qrCode, setQrCode] = useState(null);
  const [uri, setUri] = useState(null);
  const [web3Login] = useWeb3Login();
  const accounts = useWalletConnectAccounts();
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    if (session) {
      return;
    }

    connect().then((result) => {
      if (result?.uri) {
        setUri(result.uri);
      }
    });
  }, [connect, session, refreshCount]);

  useInterval(
    () => {
      setRefreshCount(refreshCount + 1);
    },
    session ? null : REFRESH_QRCODE_INTERVAL,
  );

  useEffect(() => {
    if (!uri) {
      return;
    }

    qrcode
      .toDataURL(uri, {
        width: SIZE,
        height: SIZE,
        scale: 6,
      })
      .then(setQrCode);
  }, [uri]);

  useEffect(() => {
    if (accounts?.length) {
      const account = accounts[0];

      if (account) {
        web3Login({
          account: { address: account?.address },
          wallet: account.meta?.source,
        });
      }
    }
  }, [accounts, web3Login]);

  useUnmount(() => {
    // disconnectPairing();
  });

  return (
    <div>
      <WalletOptionsWrapper className="mb-6">
        <WalletOption
          installed
          logo={<ArrowCircleLeft className="text-textSecondary" />}
          title="Back to Substrate"
          onClick={() => {
            setView("substrate");
          }}
        />
      </WalletOptionsWrapper>

      <WalletGroupTitle>Scan With Your Phone</WalletGroupTitle>

      <div className="flex justify-center">
        <div style={{ width: SIZE, height: SIZE }}>
          {qrCode ? (
            <img src={qrCode} alt="qrcode" className="rounded-md" />
          ) : (
            <Skeleton />
          )}
        </div>
      </div>
    </div>
  );
}
