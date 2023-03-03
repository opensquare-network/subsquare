import React from "react";
import { useThemeSetting } from "../../../../../context/theme";
import User from "../../../../user";
import { ItemWrapper } from "./styled";

export default function BeneficiaryItem({ beneficiary }) {
  const theme = useThemeSetting();
  return (
    <ItemWrapper>
      <span>Beneficiary:</span>
      <User
        add={beneficiary}
        fontSize={12}
        showAvatar={false}
        color={theme.secondaryBlue500}
      />
    </ItemWrapper>
  );
}
