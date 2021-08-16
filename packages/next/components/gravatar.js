import styled from "styled-components";
import md5 from "md5";

const AvatarImg = styled.img`
  border-radius: 50%;
`;

export default function Grvatar({ email = null, emailMD5 = null, size = 24 }) {
  let src = `https://gravatar.loli.net/avatar/ba25ffeebfa51822fff28c02fd6d981f?d=retro&s=${size}`;
  if (email || emailMD5) {
    src = `https://gravatar.loli.net/avatar/${
      emailMD5 ?? md5(email.trim().toLocaleLowerCase())
    }?d=retro&s=${size}&date=${new Date().toISOString().split("T")[0]}`;
  }
  return <AvatarImg src={src} />;
}
