import { SystemReply } from "@osn/icons/subsquare";
import { Item } from "./styled";

export default function ReplyButton({ noHover, onReply }) {
  return (
    <Item
      onClick={() => {
        if (!noHover) {
          onReply && onReply();
        }
      }}
      noHover={noHover}
    >
      <SystemReply className="w-5 h-5" />
      <div>Reply</div>
    </Item>
  );
}
