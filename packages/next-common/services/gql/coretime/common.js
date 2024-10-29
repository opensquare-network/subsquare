export const COMMON_SALE_FIELDS = `
  id
  purchaseCount
  purchaseRevenue
  renewalCount
  renewalRevenue
  totalRevenue
`;

export const INFO_FIELDS = `
  info {
    coresOffered
    coresSold
    endPrice
    firstCore
    idealCoresSold
    leadinLength
    price
    regionBegin
    regionEnd
    saleStart
    selloutPrice
  }
`;

export const INDEXER_FIELDS = `
  blockHeight
  blockTime
  eventIndex
  extrinsicIndex
`;
