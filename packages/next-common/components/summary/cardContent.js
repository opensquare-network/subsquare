import styled from "styled-components";
import tw from "tailwind-styled-components";

const Comp = tw.div`
  text16Bold
`;

const Content = styled(Comp)`
  color: var(--textPrimary);

  > .unit {
    color: var(--textTertiary);
  }

  > .total {
    font-size: 12px;
    color: var(--textTertiary);
  }

  > .upper {
    text-transform: uppercase;
  }

  > :not(:first-child) {
    margin-left: 4px;
  }
`;

export default Content;
