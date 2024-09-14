import tw from "tailwind-styled-components";
import { StatusWrapper } from "../popup/styled";

const ErrorMessage = tw(StatusWrapper)`
  bg-red100
  !text-red500
`;

export default ErrorMessage;
