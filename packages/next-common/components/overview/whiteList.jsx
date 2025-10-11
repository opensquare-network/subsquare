import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import useWhitelist from "next-common/hooks/useWhitelist";
import Copyable from "next-common/components/copyable";
import usePreimage from "next-common/hooks/useWhitelist/usePreimage";
import { useMemo, useState } from "react";
import PreImageDetailPopup from "../preImages/preImageDetailPopup";

export default function Whitelist() {
  const list = useWhitelist();
  const [showArgumentsDetail, setShowArgumentsDetail] = useState();

  if (!list.length) {
    return null;
  }

  return (
    <div>
      <TitleContainer className="flex justify-start mb-4 gap-1">
        Whitelist
      </TitleContainer>
      <div className="p-6 bg-neutral100 shadow-100 border border-neutral300 rounded-xl grid sm:grid-cols-2 gap-2">
        {list?.map((add) => (
          <Item
            key={add}
            add={add}
            hash={add}
            setShowArgumentsDetail={setShowArgumentsDetail}
          />
        ))}
      </div>
      {showArgumentsDetail && (
        <PreImageDetailPopup
          setShow={() => setShowArgumentsDetail(null)}
          proposal={showArgumentsDetail}
        />
      )}
    </div>
  );
}

const Item = ({ hash, setShowArgumentsDetail }) => {
  const info1 = usePreimage(hash);
  const { proposal } = info1;

  return (
    <div className=" overflow-hidden flex bg-neutral200 rounded-lg text14Medium py-2.5 px-4 justify-between">
      <div className="flex md:flex-row flex-col items-center md:gap-1.5 xl:gap-2">
        <Copyable className="flex items-center" copyText={hash}>
          <span className="text14Medium text-textPrimary inline-block w-[180px] truncate">
            {hash}
          </span>
        </Copyable>
        <div className="w-full text14Medium">
          <p className="text-textSecondary">{info1.proposalWarning}</p>
          <p
            className="hover:underline cursor-pointer"
            onClick={() => {
              setShowArgumentsDetail(proposal);
            }}
          >
            <CallName info={info1} />
          </p>
        </div>
      </div>
    </div>
  );
};

const CallName = ({ info }) => {
  const { proposal } = info;
  const call = useMemo(
    () =>
      proposal?.callIndex
        ? proposal.registry.findMetaCall(proposal.callIndex)
        : null,
    [proposal],
  );
  if (!call) {
    return null;
  }

  const { method = "", section = "" } = call;
  const callName = `${section}.${method}`;

  return call ? callName : null;
};
