import axios from 'axios';

export const freQtyOnChangeHandelarFunc = async (
  buId,
  values,
  items,
  setRowData,
  payload,
  setLoading
) => {
  setLoading(true)
  try {
    const res = await axios.post(
      `/rtm/TradeOfferGet/SalesOrderDiscountList`,
      payload,
    );

    if (res?.status === 200) {
      // fliter free items
      const products = items?.map((product, index) => {
        const isFreeItem = res?.data[index]?.item?.filter((itm) => itm?.isFree);
        // sum total Free item quantities
        const numFreeDelvQty = isFreeItem.reduce(
          (acc, cur) => (acc += cur?.quantity),
          0,
        );

        return {
          ...product,
          numFreeDelvQty: numFreeDelvQty || 0,
          freeProductId: isFreeItem?.[0]?.itemId || 0,
          freeProductName: isFreeItem?.[0]?.itemName || '',
        };
      });

      setRowData(products);
      setLoading(false)
    }
  } catch (err) {
    console.log(err)
    alert("error")
    JSON.stringify(err,null,2)
    setLoading(false)
  }
};
