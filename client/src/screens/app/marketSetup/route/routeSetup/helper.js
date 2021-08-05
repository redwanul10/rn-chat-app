import axios from 'axios';

// Pagination Added In This Landing Api
export const getRouteLandingData = async (
  accId,
  buId,
  setLoading,
  landingData,
  setRouteLandingData,
  pageNo,
  type,
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/rtm/Route/GetRouteLandingPagination?AccountId=${accId}&BusinessUnitId=${buId}&viewOrder=desc&PageNo=${pageNo}&PageSize=15`,
    );
    if (landingData?.data?.length > 0 && type === 2) {
      const payload = {
        ...res,
        data: [...landingData?.data, ...res?.data?.data],
      };
      setRouteLandingData(payload);
    } else {
      setRouteLandingData(res?.data);
    }
    setLoading(false);
  } catch (err) {
    setLoading(false);
  }
};
