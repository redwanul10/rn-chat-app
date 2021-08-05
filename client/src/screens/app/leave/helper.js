import axios from 'axios';

export const getLeaveLandingData = async (empId, setLoading, setter) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/hcm/OfficialMovement/OfficialMovementLandingPagination?EmployeeId=${empId}&PageNo=1&PageSize=100&viewOrder=desc`,
    );

    setLoading(false);
    setter(res?.data);
  } catch (err) {
    setLoading(false);
  }
};
