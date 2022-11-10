/* eslint-disable react/jsx-key */
import { useRef, useState } from "react";
import SourceTabs, {
  Polkassembly,
  SubSquare,
} from "next-common/components/comment/sourceTabs";
import useCommentComponent from "next-common/components/useCommentComponent";
import PolkassemblyComments from "./polkassemblyComments";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import Chains from "next-common/utils/consts/chains";
import { useChain } from "next-common/context/chain";
import { useUser } from "next-common/context/user";

export default function useUniversalComments({ detail, comments, type }) {
  const chain = useChain();
  const loginUser = useUser();
  const defaultTabIndex =
    detail?.polkassemblyId !== undefined &&
    detail?.dataSource === "polkassembly" &&
    !detail?.edited
      ? Polkassembly
      : SubSquare;
  const paBtnRef = useRef();
  const [tabIndex, setTabIndex] = useState(defaultTabIndex);
  const { width } = useWindowSize();

  const isDotsama = [Chains.kusama, Chains.polkadot].includes(chain);

  let tabs = null;

  if (detail?.polkassemblyId !== undefined && isDotsama) {
    // Allow to switch to polkassembly comments if has corresponding pa post
    if (parseInt(width) <= 768) {
      tabs = (
        <div style={{ width: "100%" }}>
          <SourceTabs
            small={false}
            tabIndex={tabIndex}
            setTabIndex={setTabIndex}
          />
        </div>
      );
    } else if (isDotsama) {
      tabs = (
        <div style={{ width: "240px", marginTop: "-6px" }}>
          <SourceTabs tabIndex={tabIndex} setTabIndex={setTabIndex} />
        </div>
      );
    }
  }

  let { CommentComponent, focusEditor } = useCommentComponent({
    detail,
    comments,
    loginUser: user,
    chain,
    type,
    tabs,
  });

  if (tabIndex === Polkassembly) {
    CommentComponent = (
      <PolkassemblyComments
        tabs={tabs}
        detail={detail}
        type={type}
        btnRef={paBtnRef}
      />
    );

    focusEditor = () => {
      paBtnRef.current?.scrollIntoView();
    };
  }

  return { CommentComponent, focusEditor };
}
