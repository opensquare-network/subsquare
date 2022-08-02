import styled from "styled-components";

const Content = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 100%;
  color: ${(props) => props.theme.textPrimary};

  > .unit {
    color: ${(props) => props.theme.textTertiary};
  }

  > .total {
    font-size: 12px;
    color: ${(props) => props.theme.textTertiary};
  }

  > .upper {
    text-transform: uppercase;
  }

  > :not(:first-child) {
    margin-left: 4px;
  }
`;

export default Content;
