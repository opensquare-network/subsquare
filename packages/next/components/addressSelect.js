import styled, { css } from "styled-components";
import { useState, useRef } from "react";

import { useOnClickOutside } from "utils/hooks";
import { addressEllipsis } from "utils";
import Avatar from "components/avatar";
import Flex from "./styled/flex";
import Relative from "./styled/relative";
import { shadow_200 } from "../styles/componentCss";

const Wrapper = Relative;

const Select = styled(Flex)`
  background: #ffffff;
  border: 1px solid #e0e4eb;
  border-radius: 4px;
  height: 56px;
  padding: 0 16px;
  cursor: pointer;
  > :not(:first-child) {
    margin-left: 16px;
  }
  > img:first-child {
    width: 32px;
    height: 32px;
    flex: 0 0 auto;
  }
  > img:last-child {
    width: 14px;
    height: 14px;
    flex: 0 0 auto;
    margin-left: auto;
  }
`;

const NameWrapper = styled.div`
  flex-grow: 1;
  > :last-child {
    margin-top: 4px;
    font-size: 12px;
    color: #9da9bb;
  }
`;

const Options = styled.div`
  position: absolute;
  width: 100%;
  margin-top: 4px;
  padding: 8px 0;
  background: #ffffff;
  ${shadow_200};
  border-radius: 4px;
`;

const Item = styled(Flex)`
  background: #ffffff;
  height: 56px;
  padding: 0 16px;
  cursor: pointer;
  > :not(:first-child) {
    margin-left: 16px;
  }
  > img:first-child {
    width: 32px;
    height: 32px;
    flex: 0 0 auto;
  }
  :hover {
    background: #f6f7fa;
  }
  ${(p) =>
    p.selected &&
    css`
      background: #f6f7fa;
    `}
`;

export default function AddressSelect({ accounts, selectedAccount, onSelect }) {
  const [show, setShow] = useState(false);
  const ref = useRef();

  useOnClickOutside(ref, () => setShow(false));

  return (
    <Wrapper ref={ref}>
      <Select onClick={() => setShow(!show)}>
        {selectedAccount && (
          <>
            <Avatar address={selectedAccount?.karuraAddress} />
            <NameWrapper>
              <div>{selectedAccount?.name}</div>
              <div>{addressEllipsis(selectedAccount?.karuraAddress)}</div>
            </NameWrapper>
          </>
        )}
        <img
          alt=""
          src={show ? "/imgs/icons/caret-up.svg" : "/imgs/icons/caret-down.svg"}
        />
      </Select>
      {show && (
        <Options>
          {(accounts || []).map((item, index) => (
            <Item
              key={index}
              onClick={() => {
                onSelect(item);
                setShow(false);
              }}
              selected={item.address === selectedAccount?.address}
            >
              <Avatar address={item.karuraAddress} />
              <NameWrapper>
                <div>{item.name}</div>
                <div>{addressEllipsis(item.karuraAddress)}</div>
              </NameWrapper>
            </Item>
          ))}
        </Options>
      )}
    </Wrapper>
  );
}
