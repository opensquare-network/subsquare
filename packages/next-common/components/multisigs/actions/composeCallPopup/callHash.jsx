import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";

export default function CallHash({ callHash }) {
  if (!callHash) {
    return null;
  }

  return (
    <div>
      <TitleContainer className="text14Bold px-0 pb-2">
        Call Hash
      </TitleContainer>
      <GreyPanel className="justify-start break-all gap-x-2 text14Medium text-textPrimary py-2.5 px-4 max-w-full">
        {callHash}
      </GreyPanel>
    </div>
  );
}
