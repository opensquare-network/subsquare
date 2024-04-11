import nextApi from "next-common/services/nextApi";
import {
  gov2ReferendaHistoryWhalesApi,
  gov2ReferendaWhalesApi,
} from "next-common/services/url";

export function getReferendaWhales(page = 1, pageSize = 10) {
  return nextApi.fetch(gov2ReferendaWhalesApi, {
    page,
    pageSize,
  });
}

export function getReferendaWhalesHistory(page = 1, pageSize = 10) {
  return nextApi.fetch(gov2ReferendaHistoryWhalesApi, {
    page,
    pageSize,
  });
}
