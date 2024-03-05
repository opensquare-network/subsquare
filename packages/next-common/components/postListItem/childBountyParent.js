import isNil from "lodash.isnil";
import { MobileHiddenInfo } from "./styled";
import Anchor from "next-common/components/styled/anchor";

export default function ChildBountyParent({ data }) {
  if (!data) {
    return;
  }

  if (isNil(data.parentIndex)) {
    return;
  }

  return (
    <MobileHiddenInfo>
      <Anchor href={`/treasury/bounties/${data.parentIndex}`} passHref>
        {`Parent #${data.parentIndex}`}
      </Anchor>
    </MobileHiddenInfo>
  );
}
