export default function CoretimeDetailSaleSubscriber({ isFinal, children }) {
  // todo: 1. guard by isFinal
  // if isFinal === false -> return children, (cancel subscription)
  // if isFinal === true
  // todo: 2. subscribe current sale from graphql API
  // todo: 3. setCurrentSale data (Do not subscribe on chain sale info and update info field)
  // const [, setCurrentSale] = useSharedCoretimeSale();

  return children;
}
