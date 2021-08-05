import axios from 'axios';
import {Toast} from 'native-base';

export const getTerritoryDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/rtm/RTMDDL/GetTerritotoryWithLevelDDL?AccountId=${accId}&BusinessUnitId=${buId}`,
    );
    setter(res?.data);
  } catch (err) {}
};

export const getRetailOrderDeliveryLandingData = async (
  status,
  distributorId,
  routeId,
  fromDate,
  toDate,
  setter,
  setLoading,
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/rtm/SecondaryDelivery/SecondaryDeliveryLanding?OrderSataus=${status}&DistributorId=${distributorId}&routeId=${routeId}&Fromdate=${fromDate}&Todate=${toDate}&PageNo=0&PageSize=1000&vieworder=desc`,
    );
    setter(res?.data);
    setLoading(false);
  } catch (err) {
    setLoading(false);
  }
};
export const getVehicleDDL = async (accId, buId, distributorId, setter) => {
  try {
    const res = await axios.get(
      `/rtm/RTMDDL/GetVehicleInfoByRouteId?AccountId=${accId}&BusinessUnitId=${buId}&DistributorId=${distributorId}`,
    );
    setter(res?.data);
  } catch (err) {
    // alert('vehicle alrrt');
  }
};

export const getRetailDelivery = async (
  deliveryId,
  orderNo,
  setter,
  setdeliveryItems,
) => {
  try {
    const res = await axios.get(
      `/rtm/SecondaryDelivery/GetSecondaryDelivery?DeliveryId=${deliveryId}`,
    );

    let values = res?.data?.objHeader[0];
    let deliveryItems = res?.data?.objRow;
    const initValues = {
      territory: {
        value: values?.territoryid,
        label: values?.territoryName,
      },
      distributor: {
        value: values?.businessPartnerId,
        label: values?.businessPartnerName,
      },
      distributorChannel: {
        value: values?.distributionChannelId,
        label: values?.distributionChannel,
      },
      route: {
        value: values?.routId,
        label: values?.routName,
      },
      vehicle: {
        value: values?.vehicleId,
        label: values?.vehicleNo,
      },
      beat: {
        value: values?.beatId,
        label: values?.beatName,
      },
      outlet: {
        value: values?.outletId,
        label: values?.outletName,
      },
      orderNum: {
        value: orderNo,
        label: orderNo,
      },
      totalOrderAmount: values?.numTotalOrderAmount?.toString(),
      totalAdvanceAmount: values?.advanceAmount?.toString(),
      totalReceiveAmount: values?.monReceiveAmount?.toString(),
      dueAmount: values?.numDueAmount?.toString(),
      totalDeliveryAmount: values?.numTotalDeliveryAmount?.toString(),
      collectionAmount: '',
    };
    setter(initValues);
    setdeliveryItems(deliveryItems);
  } catch (err) {
    // alert(err.response.data.message);
  }
};

export const getRetailDeliveryPending = async (
  orderId,
  setter,
  setpendingDeliveryItems,
) => {
  try {
    const res = await axios.get(
      `/rtm/SecondaryOrder/GetSecondaryOrderById?OrderId=${orderId}`,
    );

    let values = res?.data?.objHeader;
    let pendingDeliveryItems = res?.data?.objRow;

    let total = values?.totalOrderAmount - values?.receiveAmount;

    const initValues = {
      ...values,
      territory: {
        value: values?.territoryId,
        label: values?.territoryName,
      },
      distributor: {
        value: values?.businessPartnerId,
        label: values?.businessPartnerName,
      },
      distributorChannel: {
        value: values?.distributionChannelId,
        label: values?.distributionChannelName,
      },
      route: {
        value: values?.routeId,
        label: values?.routeName,
      },
      vehicle: {
        value: values?.vehicleId,
        label: values?.vehicleNo,
      },
      beat: {
        value: values?.beatId,
        label: values?.beatName,
      },
      outlet: {
        value: values?.outletid,
        label: values?.outletName,
      },
      orderNum: {
        value: values?.orderDate,
        label: values?.orderCode,
      },
      // Assign By Iftakhar Alam
      totalOrderAmount: values?.totalOrderAmount?.toFixed(3)
        ? values?.totalOrderAmount?.toFixed(3)?.toString()
        : values?.totalOrderAmount,
      totalAdvanceAmount: values?.totalOrderAmount?.toFixed(3)
        ? values?.receiveAmount?.toFixed(3)?.toString()
        : values?.receiveAmount,
      staticDueAmount: total,
      totalReceiveAmount: '0',
      dueAmount: '',
      totalDeliveryAmount: '',
    };
    setter(initValues);

    const items = pendingDeliveryItems?.map((item) => ({
      ...item,
      pendingDeliveryQuantity: item?.orderQuantity - item?.deliveryQuantity,
      staticPendingQty: item?.orderQuantity - item?.deliveryQuantity,
    }));
    setpendingDeliveryItems(items);
  } catch (err) {
    // alert(err.response.data.message);
  }
};

export const createRetailOrderDelivery = async (payload,setLoading, cb) => {
  setLoading(true)
  try {
    const res = await axios.put(
      `/rtm/SecondaryDelivery/CreateSecondaryDeliveryCollection`,
      payload,
    );
    Toast.show({
      text: res.message || 'Created Successfull',
      // buttonText: 'close',
      type: 'success',
      duration: 3000,
    });

    setLoading(false)
    cb();
  } catch (err) {
    setLoading(false)
    // alert(err.response.data.message)
    Toast.show({
      text: err.response.data.message,
      // buttonText: 'close',
      type: 'danger',
      duration: 3000,
    });
  }
};
export const createRetailOrderDeliveryPending = async (
  payload,
  cb,
  setLoading,
) => {
  setLoading(true);

  try {
    const res = await axios.post(
      `/rtm/SecondaryDelivery/CreateSecondaryDeliveryApps`,
      payload,
    );

    Toast.show({
      text: res.message || 'Created Successfully',
      // buttonText: 'close',
      type: 'success',
      duration: 3000,
    });
    setLoading(false);
    cb();
  } catch (err) {
    setLoading(false);
    // alert(err.response.data.message);
    Toast.show({
      text: err.response.data.message,
      // buttonText: 'close',
      type: 'danger',
      duration: 3000,
    });
  }
};

export const getRetailOrderDirectDeliveryLandingData = async (
  fromDate,
  toDate,
  distributorId,
  routeId,
  statusId,
  setter,
  setLoading,
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/rtm/RetailDeliveryWithoutOrder/GetRetailDeliveryWithoutOrderLanding?OrderSataus=${statusId}&DistributorId=${distributorId}&routeId=${routeId}&Fromdate=${fromDate}&Todate=${toDate}&PageNo=0&PageSize=1000&vieworder=desc`,
    );
    setter(res?.data);
    setLoading(false);
  } catch (err) {
    setLoading(false);
  }
};
