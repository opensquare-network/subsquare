const getMultisigsQuery = (address, page, pageSize) => `query MyQuery {
  multisigs(
    limit: ${pageSize}
    offset: ${(page - 1) * pageSize}
    signatory: "${address}"
  ) {
    total
    offset
    limit
    multisigs {
      address
      approvals
      call
      callHash
      callHex
      depositor
      signatories
      threshold
      when {
        index
        height
      }
      state {
        name
        args
      }
      updateAt {
        blockHeight
        eventIndex
        extrinsicIndex
      }
    }
  }
}`;

export const getMultisigsCountQuery = (address) => `query MyQuery {
  multisigs(
    signatory: "${address}"
    multisigState: APPROVING
    limit: 10
    offset: 0
  ) {
    total
  }
}`;

export default getMultisigsQuery;
