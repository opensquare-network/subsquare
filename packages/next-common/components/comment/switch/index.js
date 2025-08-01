import { isNil } from "lodash-es";
import { useSwitchCommentTabs } from "next-common/context/post/switchComment";
import { TabSwitch } from "next-common/hooks/useTabSwitch";

export default function CommentSwitch() {
  const commentTabs = useSwitchCommentTabs();

  if (isNil(commentTabs)) {
    return null;
  }

  const { switchTabs, activeTab, setActiveTab } = commentTabs;

  return (
    <TabSwitch
      value={activeTab}
      tabs={switchTabs}
      onChange={setActiveTab}
      className="w-auto"
      buttonClassName="w-[110px] [&_.total]:text-textTertiary"
    />
  );
}
