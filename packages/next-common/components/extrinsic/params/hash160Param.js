import TextParam from "./textParam";

export default function Hash160Param() {
  return <TextParam placeholder="0x prefixed hex, e.g. 0x1234 or ascii data" />;
}
