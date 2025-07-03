import Duration from "next-common/components/duration";
import {
  HtmlPreviewer,
  MarkdownPreviewer,
  renderMentionIdentityUserPlugin,
} from "@osn/previewer";
import IdentityOrAddr from "next-common/components/IdentityOrAddr";
import { prettyHTML } from "next-common/utils/viewfuncs";
import Divider from "next-common/components/styled/layout/divider";
import AddressUser from "next-common/components/user/addressUser";
import { SystemActivity } from "@osn/icons/subsquare";
import { formatTimeAgo } from "next-common/utils/viewfuncs/formatTimeAgo";
import Tooltip from "next-common/components/tooltip";
import { SystemMore } from "@osn/icons/subsquare";
import { useState, useRef } from "react";
import { OptionWrapper } from "next-common/components/internalDropdown/styled";
import {
  EditMenuItem,
  DeleteMenuItem,
} from "next-common/components/contentMenu";
import { useClickAway } from "react-use";
import useIsAuthor from "./useIsAuthor";
import dynamicPopup from "next-common/lib/dynamic/popup";

const AppendantPopup = dynamicPopup(() =>
  import("next-common/components/appendant"),
);

function SplitDot() {
  return <span className="text-textTertiary text12Medium mx-2">·</span>;
}

// TODO: remove
function MoreActions({ data }) {
  const [show, setShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const ref = useRef();

  useClickAway(ref, () => setShow(false));

  return (
    <>
      <div ref={ref} className="relative">
        <SystemMore
          className="w-5 h-5 [&_path]:fill-textTertiary cursor-pointer"
          onClick={() => {
            setShow(!show);
          }}
        />
        {show && (
          <OptionWrapper>
            <EditMenuItem setIsEdit={setIsEdit} setShow={setShow} />
            <DeleteMenuItem
              setShowReportPopup={setShowDeletePopup}
              setShow={setShow}
            />
          </OptionWrapper>
        )}
      </div>

      {isEdit && (
        <AppendantPopup
          setIsAppend={setIsEdit}
          editData={data}
          isEditMode={true}
        />
      )}
    </>
  );
}

function Activity({ data }) {
  return (
    <div className="inline-flex items-center justify-start space-x-1 text12Medium text-textSecondary">
      <SystemActivity className="w-4 h-4 text-textTertiary [&_path]:stroke-2" />
      <Tooltip
        className="flex cursor-pointer"
        content={
          <div className="text12Medium">
            <ul className="list-disc list-inside">
              <li>Created at {formatTimeAgo(data?.createdAt)}</li>
              <li>Latest activity at {formatTimeAgo(data?.updatedAt)}</li>
            </ul>
          </div>
        }
      >
        <Duration time={data.createdAt} />
      </Tooltip>
    </div>
  );
}

function Header({ index, data }) {
  return (
    <div className="inline-flex items-center justify-start">
      <span className="text12Bold text-textPrimary">#{index + 1}</span>
      <SplitDot />
      <AddressUser
        key="user"
        add={data?.author?.address}
        className="text12Medium"
        avatarSize="20px"
      />
      <SplitDot />
      <Activity data={data} />
    </div>
  );
}

function Content({ data }) {
  return (
    <div>
      <span className="text-textPrimary">
        {data.contentType === "markdown" && (
          <MarkdownPreviewer
            content={data.content || ""}
            plugins={[renderMentionIdentityUserPlugin(<IdentityOrAddr />)]}
            markedOptions={{
              breaks: true,
            }}
          />
        )}
        {data.contentType === "html" && (
          <HtmlPreviewer
            content={prettyHTML(data.content)}
            plugins={[
              renderMentionIdentityUserPlugin(<IdentityOrAddr />, {
                targetElement: { tag: "span" },
              }),
            ]}
          />
        )}
      </span>
    </div>
  );
}

export default function AppendentItem({ index, data }) {
  const isAuthor = useIsAuthor(data);

  return (
    <>
      <Divider className="my-4" />
      <div className="flex flex-col gap-[8px]">
        <div className="flex items-center justify-between">
          <Header index={index} data={data} />
          {isAuthor && <MoreActions data={data} />}
        </div>
        <Content data={data} />
      </div>
    </>
  );
}
