import axios from 'axios';

export const getAttendanceList = async (
  empId,
  month,
  year,
  setLoading,
  setter,
  cancelToken,
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/hcm/EmployeeAttendance/GetAttendanceEmployeeApp?EmployeeId=${empId}&month=${month}&YearId=${year}`,
      // `/hcm/EmployeeAttendance/GetAttendanceEmployee?EmployeeId=${empId}&month=${month}&YearId=${year}`,
      {cancelToken: cancelToken.token},
    );
    setter(res?.data);
    setLoading(false);
  } catch (err) {
    if (err?.message !== 'canceled request') {
      setLoading(false);
    }
  }
};

export const getEmployeeDDL = async (accId, buId, empId, setter) => {
  try {
    const res = await axios.get(
      `/rtm/RTMDDL/GetEmployeeUnderSupervisorDDL?accountId=${accId}&businessUnitId=${buId}&EmployeeId=${empId}`,
    );

    setter(res?.data);
  } catch (err) {}
};
