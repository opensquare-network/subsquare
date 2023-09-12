import { useEffect, useRef, useState } from "react";
import SourceTabs, {
  Polkassembly,
  SubSquare,
} from "next-common/components/comment/sourceTabs";
import useCommentComponent from "next-common/components/useCommentComponent";
import PolkassemblyComments from "./polkassemblyComments";
import Chains from "next-common/utils/consts/chains";
import { useChain } from "next-common/context/chain";
import useCommentsAnchor from "next-common/utils/hooks/useCommentsAnchor";

export default function useUniversalComments({ detail, comments }) {
  const chain = useChain();
  const { commentsCount, polkassemblyCommentsCount } = detail;
  let defaultTabIndex = SubSquare;
  if (commentsCount <= 0 && polkassemblyCommentsCount > 0) {
    defaultTabIndex = Polkassembly;
  }

  const paBtnRef = useRef();
  const [tabIndex, setTabIndex] = useState(defaultTabIndex);

  const { hasAnchor } = useCommentsAnchor();
  useEffect(() => {
    if (hasAnchor) {
      setTabIndex(SubSquare);
    }
  }, [hasAnchor]);

  const isPolkassemblyEnabled = [
    Chains.kusama,
    Chains.polkadot,
    Chains.moonriver,
    Chains.collectives,
  ].includes(chain);

  let tabs = null;
  if (detail?.polkassemblyId !== undefined && isPolkassemblyEnabled) {
    // Allow to switch to polkassembly comments if has corresponding pa post
    tabs = (
      <SourceTabs
        detail={detail}
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
      />
    );
  }

  let { CommentComponent, focusEditor } = useCommentComponent({
    detail,
    comments,
    tabs,
  });

  if (tabIndex === Polkassembly) {
    CommentComponent = (
      <PolkassemblyComments tabs={tabs} detail={detail} btnRef={paBtnRef} />
    );

    focusEditor = () => {
      paBtnRef.current?.scrollIntoView();
    };
  }

  return { CommentComponent, focusEditor };
}
