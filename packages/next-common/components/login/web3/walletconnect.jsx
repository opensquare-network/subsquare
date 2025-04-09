import { ArrowCircleLeft, WalletSubwallet } from "@osn/icons/subsquare";
import {
  WalletGroupTitle,
  WalletOptionsWrapper,
} from "next-common/components/wallet/options/styled";
import WalletOption from "next-common/components/wallet/walletOption";
import { useWalletConnect } from "next-common/context/walletconnect";
import { useWalletConnectAccounts } from "next-common/hooks/connect/useWalletConnectAccounts";
import { useWeb3Login } from "next-common/hooks/connect/useWeb3Login";
import { useWeb3WalletView } from "next-common/hooks/connect/useWeb3WalletView";
import { toDataURL as QrcodeToDataURL } from "qrcode";
import { useEffect, useState } from "react";
import { useInterval, useUnmount } from "react-use";

const SIZE = 200;
const REFRESH_QRCODE_INTERVAL = 4 * 60 * 1000; // 4 minutes

function Skeleton() {
  return (
    <div className="w-full h-full rounded-lg bg-gradient-to-r from-neutral300-80 to-neutral300-20 " />
  );
}

export default function LoginWeb3WalletConnect() {
  const { setView } = useWeb3WalletView();
  const { connect, session, provider } = useWalletConnect();
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

    QrcodeToDataURL(uri, {
      width: SIZE,
      height: SIZE,
      margin: 0,
    }).then(setQrCode);
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
    if (provider) {
      if (!session) {
        const pairing = provider.client.pairing.getAll().find((p) => p.topic);
        if (pairing) {
          provider.client.pairing.core.pairing.disconnect({
            topic: pairing.topic,
          });
        }
      }
    }
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
        <div className="rounded-xl border border-neutral300 overflow-hidden p-4">
          <div className="" style={{ width: SIZE, height: SIZE }}>
            {qrCode ? <img src={qrCode} alt="qrcode" /> : <Skeleton />}
          </div>

          <div className="mt-4 inline-flex items-center gap-x-1">
            <span className="text12Medium text-textTertiary">
              Recommend Use
            </span>
            <WalletSubwallet className="inline-block" />
            <span className="text14Bold text-textPrimary">SubWallet</span>
          </div>
        </div>
      </div>
    </div>
  );
}
