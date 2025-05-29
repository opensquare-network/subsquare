import { backendApi } from "next-common/services/nextApi";
import {
  gov2ReferendaHistoryWhalesApi,
  gov2ReferendaWhalesApi,
} from "next-common/services/url";

export function fetchReferendaWhales(page = 1, pageSize = 10) {
  return backendApi.fetch(gov2ReferendaWhalesApi, {
    page,
    pageSize,
  });
}

export function fetchReferendaWhalesHistory(page = 1, pageSize = 10) {
  return backendApi.fetch(gov2ReferendaHistoryWhalesApi, {
    page,
    pageSize,
  });
}
