import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { useDataTabsContext } from "../context/tabs";

export default function CommonHeader() {
  const { title = "" } = useDataTabsContext();

  return (
    <div className="w-full py-6 flex items-center justify-center">
      <TitleContainer className="!text20Bold">{title}</TitleContainer>
    </div>
  );
}
