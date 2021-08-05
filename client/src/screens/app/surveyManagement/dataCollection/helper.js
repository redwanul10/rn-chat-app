/* eslint-disable no-alert */
import axios from 'axios';
import {Toast} from 'native-base';

export const getBeatApiDDL = async (RoId, setter) => {
  try {
    let res = await axios.get(`/rtm/RTMDDL/BeatNameDDL?RouteId=${RoId}`);
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    setter([]);
  }
};

export const getSurveyDDL = async (accId, buId, setter) => {
  try {
    let res = await axios.get(
      `/rtm/RTMDDL/GetSurveyDDL?AccountId=${accId}&BusinessUnitId=${buId}`,
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    setter([]);
  }
};

export const getRouteDDL = async (accId, buId, empId, setter) => {
  try {
    let res = await axios.get(
      `/rtm/RTMDDL/GetRouteBySalesForceIdDDL?AccountId=${accId}&BusinessUnitId=${buId}&EmployeeId=${empId}`,
    );
    if (res?.status === 200) {
      setter([
        {
          value: 0,
          label: 'Random',
        },
        ...res?.data,
      ]);
    }
  } catch (err) {
    setter([
      {
        value: 0,
        label: 'Random',
      },
    ]);
  }
};

export const getLandingData = async (accId, buId, date, setter, setLoading) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `rtm/RTMSurvey/GetRTMSurveyResponseLandingPasignation?AccountId=${accId}&BusinessUnitId=${buId}&PageNo=${0}&PageSize=${1000000}&Fromdate=${date}&viewOrder=desc`,
    );
    setter(res?.data?.data);
    setLoading && setLoading(false);
  } catch (err) {
    setter([]);
    setLoading && setLoading(false);
  }
};

export const getSurveyById = async (sId, setLoader, setter) => {
  setLoader && setLoader(true);
  try {
    let res = await axios.get(
      `/rtm/RTMSurvey/GetRTMSurveyById?surveyId=${sId}`,
    );
    if (res?.status === 200) {
      const modifyDataset = res?.data?.objRow?.map((item) => {
        return {
          ...item,
          answer: '',
          objAttributes:
            item?.objAttributes?.length > 0
              ? item?.objAttributes?.map((obj) => {
                  return {
                    ...obj,
                    isSelect: false,
                  };
                })
              : [],
        };
      });
      setter(modifyDataset);
      setLoader && setLoader(false);
    }
  } catch (err) {
    setLoader && setLoader(false);
    setter([]);
  }
};

export const createSurveyAnswer = async (payload, setIsLoading, cb) => {
  setIsLoading(true);
  try {
    let res = await axios.post(
      `/rtm/RTMSurvey/CreateRTMSurveyResponse`,
      payload,
    );

    if (res?.status === 200) {
      cb();
      Toast.show({
        text: res?.data?.message,
        type: 'success',
        duration: 3000,
      });
      setIsLoading(false);
    }
  } catch (err) {
    Toast.show({
      text: err?.response?.data?.message,
      type: 'warning',
      duration: 3000,
    });
    setIsLoading(false);
  }
};

export const getSurveyAnswerById = async (id, setIsLoading, setter) => {
  setIsLoading(true);
  try {
    let res = await axios.get(
      `/rtm/RTMSurvey/GetRTMSurveyResponseById?SurveyResponseId=${id}`,
    );
    if (res?.status === 200) {
      setIsLoading(false);
      setter({
        row: res?.data?.objRow,
        outlet: {
          value: res?.data?.objHeader?.outletId
            ? res?.data?.objHeader?.outletId
            : 0,
          label: res?.data?.objHeader?.outletName
            ? res?.data?.objHeader?.outletName
            : 'Random',
        },
        survey: {
          value: res?.data?.objHeader?.surveyId,
          label: res?.data?.objHeader?.surveyName,
        },
        route: {
          value: res?.data?.objHeader?.routeId
            ? res?.data?.objHeader?.routeId
            : 0,
          label: res?.data?.objHeader?.routeName
            ? res?.data?.objHeader?.routeName
            : 'Random',
        },
        // Last Added from WEB
        market: {
          value: res?.data?.objHeader?.beatId
            ? res?.data?.objHeader?.beatId
            : 0,
          label: res?.data?.objHeader?.beatName
            ? res?.data?.objHeader?.beatName
            : 'Random',
        },
      });
    }
  } catch (err) {
    Toast.show({
      text: err?.response?.data?.message,
      type: 'warning',
      duration: 3000,
    });
    setIsLoading(false);
  }
};
