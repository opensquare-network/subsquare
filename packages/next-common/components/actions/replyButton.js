import ReplyIcon from "../../assets/imgs/icons/reply.svg";
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
      <ReplyIcon />
      <div>Reply</div>
    </Item>
  );
}
