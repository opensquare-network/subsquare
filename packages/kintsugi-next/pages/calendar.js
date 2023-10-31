import CalendarPage from "@subsquare/next/pages/calendar";
import { serverSidePropsWithSummary } from "next-common/services/serverSide/serverSidePropsWithSummary";

export default CalendarPage;

export const getServerSideProps = serverSidePropsWithSummary;
