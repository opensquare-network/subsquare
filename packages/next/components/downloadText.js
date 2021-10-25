import styled from "styled-components";

const A = styled.a`
  color: #6848FF;
`

export default function DownloadText({text, fileName = "hex"}) {
  const blob = new Blob([text], {type: "text/plain"});
  const url = window.URL.createObjectURL(blob);
  return <A href={url} download={fileName}>download</A>;
}
