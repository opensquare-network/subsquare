// TODO: delete this file #3525
// https://github.com/opensquare-network/subsquare/issues/3525

import styled from "styled-components";
import NoComment from "next-common/components/comment/noComment";
import PolkassemblyCommentButton from "./commentButton";
import Loading from "next-common/components/loading";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { cn } from "next-common/utils";
import { PolkassemblyRootComment } from "next-common/components/comment/rootComment";

const LoadingDiv = styled.div`
  display: flex;
  justify-content: center;
  padding: 18px 0;
`;

export default function PolkassemblyComments({
  detail,
  isLoading,
  comments = [],
  paId,
  tabs = null,
  btnRef = null,
}) {
  return (
    <div>
      <div className="mb-4">
        <TitleContainer className={cn("w-full !px-0", "!block")}>
          <div className="text14Bold">Comments</div>
          {tabs && <div className="mt-4">{tabs}</div>}
        </TitleContainer>
      </div>
      {isLoading ? (
        <LoadingDiv>
          <Loading size={14} />
        </LoadingDiv>
      ) : comments?.length > 0 ? (
        <div>
          {(comments || []).map((item, idx) => (
            <PolkassemblyRootComment key={idx} data={item} />
          ))}
        </div>
      ) : (
        <NoComment />
      )}
      <div>
        <PolkassemblyCommentButton
          detail={detail}
          paId={paId}
          btnRef={btnRef}
        />
      </div>
    </div>
  );
}
