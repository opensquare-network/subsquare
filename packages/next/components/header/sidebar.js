import styled from "styled-components";

const Wrapper = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  @media screen and (min-width: 901px) {
    display: none;
  }
`;

const Mask = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.24);
  position: absolute;
`;

const Content = styled.div`
  background: #ffffff;
  height: 100%;
  display: inline-block;
  position: absolute;
  @media screen and (max-width: 900px) {
    min-width: 310px;
  }
  @media screen and (max-width: 600px) {
    min-width: 278px;
  }
`;

const CloseWrapper = styled.div`
  height: 64px;
  border-bottom: 1px solid #ebeef4;
  display: flex;
  align-items: center;
`;

const Container = styled.div`
  @media screen and (max-width: 900px) {
    padding: 0 32px;
  }
  @media screen and (max-width: 600px) {
    min-width: 0 16px;
  }
`;

const CloseButton = styled.div`
  width: 38px;
  height: 38px;
  border: 1px solid #e0e4eb;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export default function Sidebar({ onClose }) {
  return (
    <Wrapper>
      <Mask onClick={onClose} />
      <Content>
        <CloseWrapper>
          <Container>
            <CloseButton>
              <img src="/imgs/icons/close.svg" onClick={onClose} />
            </CloseButton>
          </Container>
        </CloseWrapper>
      </Content>
    </Wrapper>
  );
}
