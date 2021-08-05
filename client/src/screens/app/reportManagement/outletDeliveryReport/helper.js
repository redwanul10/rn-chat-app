/* eslint-disable no-alert */
import axios from 'axios';

export const getLandingData = async (
  accId,
  buId,
  empId,
  type,
  date,
  channelId,
  setter,
  setLoading,
  setTotalOrderInfo,
) => {
  setLoading(true);
  try {
    // Last Change Assign | Emdadul Hauque | New Api make's For Apps
    const res = await axios.get(
      `/rtm/RTMSalesReport/AppsSalesForceSalesReportEx?accountId=${accId}&BusinessUnitId=${buId}&EmployeeId=${empId}&type=${type}&reportdate=${date}&ChannelId=${channelId}`,
    );
    const ResData = res?.data;
    setTotalOrderInfo({
      totalPscQuantity:
        (type === 1 && ResData?.totalOrderQty) ||
        (type === 2 && ResData?.totalDeliveryQty) ||
        (type === 3 && ResData?.totalPendingQty) ||
        0,
      totalCaseQuantity:
        (type === 1 && ResData?.totalOrderCs) ||
        (type === 2 && ResData?.totalDeliveryCs) ||
        (type === 3 && ResData?.totalPendingCs) ||
        0,
      totalAmount:
        (type === 1 && ResData?.totalOrderAmount) ||
        (type === 2 && ResData?.totalDeliveryAmount) ||
        (type === 3 && ResData?.totalPendingAmount) ||
        0,
    });
    setter(ResData?.data);
    setLoading(false);
  } catch (err) {
    setTotalOrderInfo({});
    setter({data: []});
    setLoading(false);
  }
};
