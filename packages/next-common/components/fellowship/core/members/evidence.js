import FieldLoading from "next-common/components/icons/fieldLoading";
import FellowshipMemberInfoWrapper from "./infoWrapper";
import FellowshipMemberInfoTitle from "./title";
import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";
import { textEllipsis } from "next-common/utils";
import getIpfsLink from "next-common/utils/env/ipfsEndpoint";
import { create as createDigest } from "multiformats/hashes/digest";
import { CID } from "multiformats";
import { hexToU8a } from "@polkadot/util";
import Tooltip from "next-common/components/tooltip";

function useFellowshipCoreMemberEvidence(address) {
  const api = useContextApi();
  const [wish, setWish] = useState("");
  const [evidence, setEvidence] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!api || !address) {
      return;
    }

    setLoading(true);
    setEvidence("");
    setWish("");

    api.query.fellowshipCore
      ?.memberEvidence(address)
      .then((evidence) => {
        const data = evidence?.toJSON();
        if (!data) {
          return;
        }
        const [wish, text] = data;
        setWish(wish);
        setEvidence(text);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [api, address]);

  return {
    wish,
    evidence,
    loading,
  };
}

export default function FellowshipCoreMemberEvidence({ address }) {
  const { loading, wish, evidence } = useFellowshipCoreMemberEvidence(address);

  let content = null;
  if (loading) {
    content = <FieldLoading size={16} />;
  } else if (evidence) {
    const SHA_256_CODE = 0x12;
    const cid = CID.createV0(createDigest(SHA_256_CODE, hexToU8a(evidence)))
      .toV1()
      .toString();
    content = (
      <div className="flex gap-[8px]">
        <Tooltip content="Wish">
          <span className="capitalize">{wish}</span>
        </Tooltip>
        <a
          className="cursor-pointer text-sapphire500"
          target="_blank"
          rel="noreferrer"
          href={getIpfsLink(cid)}
        >
          {textEllipsis(cid, 4, 4)}
        </a>
      </div>
    );
  } else {
    content = <span className="text-textTertiary">-</span>;
  }

  return (
    <FellowshipMemberInfoWrapper>
      <FellowshipMemberInfoTitle>Evidence</FellowshipMemberInfoTitle>
      <div className="flex text12Medium">{content}</div>
    </FellowshipMemberInfoWrapper>
  );
}
