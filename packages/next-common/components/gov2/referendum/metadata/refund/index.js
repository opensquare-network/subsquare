import { useOnchainData } from "next-common/context/post";
import { useEffect, useState } from "react";
import useApi from "next-common/utils/hooks/useApi";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import styled from "styled-components";
import SubLink from "next-common/components/styled/subLink";
import dynamic from "next/dynamic";

const RefundPopup = dynamic(() => import("./popup"), { ssr: false });

const Wrapper = styled.div`
  font-weight: 500;
  color: var(--textTertiary);
  &::before {
    content: "·";
    color: var(--textTertiary);
    padding-right: 8px;
  }

  a {
    color: var(--theme500);
  }
`;

export default function RefundDecisionDeposit({ pallet = "referenda" }) {
  const { referendumIndex } = useOnchainData();
  const api = useApi();
  const isMounted = useIsMounted();
  const [info, setInfo] = useState();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!api) {
      return;
    }

    let unsub;
    api.query[pallet].referendumInfoFor(referendumIndex, (optionalInfo) => {
      if (!isMounted.current || !optionalInfo.isSome) {
        return;
      }

      setInfo(optionalInfo.unwrap().toJSON());
    });

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [api, referendumIndex]);

  const { approved, rejected, timedOut, cancelled } = info || {};
  const possibleValue = approved || rejected || timedOut || cancelled;
  if (!possibleValue) {
    return null;
  }

  const [, , deposit] = approved || rejected || timedOut || cancelled;
  if (!deposit) {
    return <Wrapper>Refunded</Wrapper>;
  }

  return (
    <Wrapper>
      <SubLink
        disabled={false}
        onClick={() => {
          setShowPopup(true);
        }}
      >
        Refund
      </SubLink>
      {showPopup && (
        <RefundPopup
          referendumIndex={referendumIndex}
          pallet={pallet}
          onClose={() => setShowPopup(false)}
        />
      )}
    </Wrapper>
  );
}
