import styled from "styled-components";
import { hexEllipsis } from "../utils";

const Between = styled.div`
  display: flex;
  justify-content: space-between;
`

const A = styled.a`
  color: #6848FF;
`

export default function LongText({text, threshold = 200, fileName = "hex"}) {
  if (text?.length <= 200) {
    return text;
  }
  const blob = new Blob([text], {type: "text/plain"});
  const url = window.URL.createObjectURL(blob);
  return <Between>
    <span>{hexEllipsis(text)}</span>
    <A href={url} download={fileName}>download</A>
  </Between>;
}
