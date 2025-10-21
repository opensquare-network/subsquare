import React, { useRef, useState } from "react";
import { OptionWrapper } from "next-common/components/internalDropdown/styled";
import { SystemMore } from "@osn/icons/subsquare";

import { useClickAway } from "react-use";
import { useChainSettings } from "next-common/context/chain";
import { useReferendaAppendantsContext } from "next-common/context/referendaAppendants";

import {
  EditMenuItem,
  ReportMenu,
  LinkOrUnlinkMenu,
  CancelReferendumMenu,
  KillReferendumMenu,
  AppendReferendaMenu,
} from "./common";

export default function ReferendaArticleMoreMenu({
  isAuthor,
  editable,
  setIsEdit,
}) {
  const ref = useRef();
  const [show, setShow] = useState(false);
  const { appendants } = useReferendaAppendantsContext();
  const { newProposalQuickStart: { cancelReferendum, killReferendum } = {} } =
    useChainSettings();

  useClickAway(ref, () => setShow(false));

  return (
    <div ref={ref} className="relative">
      <SystemMore
        className="w-5 h-5 [&_path]:fill-textTertiary cursor-pointer"
        onClick={() => setShow(!show)}
      />
      {
        <OptionWrapper className={!show && "hidden"}>
          {editable && (
            <EditMenuItem
              onClick={() => {
                setIsEdit(true);
                setShow(false);
              }}
            />
          )}
          {<AppendReferendaMenu setShow={setShow} />}
          {editable && isAuthor && !appendants?.length && (
            <LinkOrUnlinkMenu setShow={setShow} />
          )}
          <ReportMenu setShow={setShow} />
          {cancelReferendum && <CancelReferendumMenu setShow={setShow} />}
          {killReferendum && <KillReferendumMenu setShow={setShow} />}
        </OptionWrapper>
      }
    </div>
  );
}
