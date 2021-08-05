import axios from 'axios';
import {_todayDate} from '../../../../../common/functions/_todayDate';

export const getStockAllocation_api = async (
  accId,
  busId,
  routeId,
  beatId,
  outletId,
  date,
  setter,
  // setValues,
  // values
) => {
  try {
    const res = await axios.get(
      `/rtm/StockAllocation/GetStockAllocation?AccountId=${accId}&BusinessUnitId=${busId}&RoutId=${routeId}&MarketId=${beatId}&OutletId=${outletId}&date=${date}`,
    );
    if (res?.status === 200 && res?.data) {
      if (res?.data?.length > 0) {
        const modifyRowData = res?.data?.map((itm) => ({
          ...itm,
          averageSales: itm?.averageSales.toFixed(2),
          safetyStock: itm?.safetyStock.toFixed(2),
        }));
        setter(modifyRowData);
      } else {
        setter([]);
      }
    }
  } catch (error) {}
};
