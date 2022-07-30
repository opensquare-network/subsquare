import LayoutBase from "./layoutBase";
import OutWrapper from "../styled/outWrapper";
import MainCard from "../styled/mainCard";

export default function DetailWithRightLayout({
  user,
  children,
  isWeb3Login,
  seoInfo,
}) {
  return (
    <LayoutBase user={user} isWeb3Login={isWeb3Login} seoInfo={seoInfo}>
      <OutWrapper>
        <MainCard className="post-content">{children}</MainCard>
      </OutWrapper>
    </LayoutBase>
  );
}
