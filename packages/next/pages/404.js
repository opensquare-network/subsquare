import styled from "styled-components";
import { useRouter } from "next/router";

const Wrapper = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  button {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 12px;
    background: #6848ff;
    border-radius: 4px;
    flex: none;
    order: 2;
    flex-grow: 0;
    color: #fff;
    border: none;
    cursor: pointer;
  }
`;

const P = styled.p`
  margin: 24px;
  font-size: 14px;
  font-weight: normal;
  line-height: inherit;
  padding: 0;
`;

export default function Custom404() {
  const router = useRouter();
  return (
    <Wrapper>
      <svg
        width="150"
        height="60"
        viewBox="0 0 150 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17.641 25.7143H8.82049V17.1429H17.641V25.7143ZM35.282 42.8571V60H26.4615V42.8571H0V25.7143H8.82049V34.2857H26.4615V17.1429H17.641V8.57143H26.4615V0H35.282V34.2857H44.1024V42.8571H35.282Z"
          fill="#D7DEE8"
        />
        <path
          d="M79.4102 34.2857H70.5898V25.7143H79.4102V34.2857ZM61.7693 51.4286H52.9488V8.57143H61.7693V51.4286ZM97.0512 51.4286H88.2307V8.57143H97.0512V51.4286ZM88.2307 8.57143H61.7693V0H88.2307V8.57143ZM88.2307 60H61.7693V51.4286H88.2307V60Z"
          fill="#D7DEE8"
        />
        <path
          d="M123.539 25.7143H114.718V17.1429H123.539V25.7143ZM141.18 42.8571V60H132.359V42.8571H105.898V25.7143H114.718V34.2857H132.359V17.1429H123.539V8.57143H132.359V0H141.18V34.2857H150V42.8571H141.18Z"
          fill="#D7DEE8"
        />
      </svg>
      <P>This page could not be found.</P>
      <button
        onClick={() => {
          const currChain = localStorage.getItem("chain") || "karura";
          router.push({
            pathname: "/[chain]",
            query: { chain: currChain },
          });
        }}
      >
        {" "}
        Back to Home
      </button>
    </Wrapper>
  );
}
