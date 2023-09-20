import { useChain } from "next-common/context/chain";
import { useEffect, useState } from "react";
import styled from "styled-components";

const Divider = styled.div`
  width: 1px;
  height: 100%;
  background: var(--neutral300);
`;

const Link = styled.a`
  display: flex;
  align-items: center;
  height: 20px;
  gap: 4px;
`;

export default function CouncilorLink({ address }) {
  const chain = useChain();
  const [isCouncilor, setIsCouncilor] = useState(false);
  useEffect(() => {
    fetch(`https://${chain}-api.dotreasury.com/participants/${address}`)
      .then(async (res) => {
        if (!res.ok) {
          return;
        }
        const data = await res.json();
        setIsCouncilor(data.isCouncilor);
      })
      .catch(console.error);
  }, [chain, address]);

  if (!isCouncilor) {
    return null;
  }

  return (
    <>
      <Divider />
      <Link
        className="text12Medium"
        href={`https://${chain}.dotreasury.com/#/users/${address}/councilor`}
        target="_blank"
        rel="noreferrer"
      >
        <span className="text-theme500">Council Votes</span>
        <i className="text-textTertiary">↗</i>
      </Link>
    </>
  );
}
