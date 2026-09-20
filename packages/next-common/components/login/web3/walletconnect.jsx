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
import { toDataURL as QrcodeToDataURL } from "qrcode";
import { useEffect, useRef, useState } from "react";
import { useInterval, useUnmount } from "react-use";
import { Skeleton } from "next-common/components/skeleton";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";

const SIZE = 200;
const REFRESH_QRCODE_INTERVAL = 4 * 60 * 1000; // 4 minutes

export default function LoginWeb3WalletConnect() {
  const { setView } = useWeb3WalletView();
  const { connect, session, provider } = useWalletConnect();
  const dispatch = useDispatch();
  const [uri, setUri] = useState(null);
  const [web3Login] = useWeb3Login();
  const accounts = useWalletConnectAccounts();
  const loginSession = useRef(null);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    if (session) {
      return;
    }

    let active = true;
    connect()
      .then((result) => {
        if (active && result?.uri) {
          setUri(result.uri);
        }
      })
      .catch((error) => dispatch(newErrorToast(error.message)));
    return () => {
      active = false;
    };
  }, [connect, session, refreshCount, dispatch]);

  useInterval(
    () => {
      setRefreshCount(refreshCount + 1);
    },
    session ? null : REFRESH_QRCODE_INTERVAL,
  );

  useEffect(() => {
    if (
      !accounts?.length ||
      !session?.topic ||
      loginSession.current === session.topic
    ) {
      return;
    }
    loginSession.current = session.topic;
    const account = accounts[0];
    web3Login({
      account: { address: account.address },
      wallet: account.meta?.source,
    });
  }, [accounts, session?.topic, web3Login]);

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
    <WalletConnectQrCode
      uri={uri}
      backTitle="Back to Substrate"
      onBack={() => setView("substrate")}
    />
  );
}

export function WalletConnectQrCode({ uri, backTitle, onBack }) {
  const [qrCode, setQrCode] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    let active = true;
    setQrCode(null);
    if (uri) {
      QrcodeToDataURL(uri, { width: SIZE, height: SIZE, margin: 0 })
        .then((code) => {
          if (active) {
            setQrCode(code);
          }
        })
        .catch((error) => {
          if (active) {
            dispatch(newErrorToast(error.message));
          }
        });
    }
    return () => {
      active = false;
    };
  }, [uri, dispatch]);

  return (
    <div>
      <WalletOptionsWrapper className="mb-6">
        <WalletOption
          installed
          logo={<ArrowCircleLeft className="text-textSecondary" />}
          title={backTitle}
          onClick={onBack}
        />
      </WalletOptionsWrapper>

      <WalletGroupTitle>Scan With Your Phone</WalletGroupTitle>

      <div className="flex justify-center">
        <div className="rounded-xl border border-neutral300 overflow-hidden p-4">
          <div style={{ width: SIZE, height: SIZE }}>
            {qrCode ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrCode} alt="WalletConnect QR code" />
            ) : (
              <Skeleton className="w-full h-full rounded-lg" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
