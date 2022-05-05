import styled from "styled-components";
import { Label, InputWrapper } from "components/setting/styled";
import User from "next-common/components/user";
import { addressEllipsis } from "utils";

const AddressWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;

  background: #F6F7FA;

  border: 1px solid #EBEEF4;
  border-radius: 4px;
`;

const FullAddress = styled.div`
  color: #9DA9BB;
  @media screen and (max-width: 1024px) {
    display: none;
  }
`;

const ShortAddress = styled.div`
  color: #9DA9BB;
  @media screen and (min-width: 1024px) {
    display: none;
  }
`;

export default function Web3Address({ address, chain }) {
  return (
    <div>
      <Label>Web3 Address</Label>
      <InputWrapper>
        <AddressWrapper>
          <User add={address} chain={chain} />
          <FullAddress>{address}</FullAddress>
          <ShortAddress>{addressEllipsis(address)}</ShortAddress>
        </AddressWrapper>
      </InputWrapper>
    </div>
  );
}
