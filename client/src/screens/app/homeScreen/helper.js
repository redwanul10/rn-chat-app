import axios from 'axios';

export const performanceValue = async (
  accId,
  buId,
  todayDate,
  lavelId,
  territoryId,
  setgaugeData,
) => {
  try {
    const res = await axios.get(
      `/rtm/RTMCommonProcess/GetSalesTargetByAchievementForDashBoard?AccountId=${accId}&BusinessUnitId=${buId}&Date=${todayDate}&LevelId=${lavelId}&TerritoryId=${territoryId}`,
    );
    setgaugeData(res?.data);
  } catch (err) {
    setgaugeData(0);
  }
};

// Last Added | ADS API
const getDashboardADSValue = async (accId, buId, territoryId, levelId) => {
  try {
    const res = await axios.get(
      `/rtm/PivotReport/GetAverageDailySales?AccountId=${accId}&BusinessUnitId=${buId}&LevelId=${levelId}&TerritoryId=${territoryId}`,
    );
    return res?.data;
  } catch (err) {
    return 0;
  }
};

// ADT
export const getADTDashboardValue = async (
  accId,
  buId,
  territoryId,
  lavelId,
) => {
  try {
    const res = await axios.get(
      `/rtm/RTMCommonProcess/GetADTForDashBoard?AccountId=${accId}&BusinessUnitId=${buId}&LevelId=${lavelId}&TerritoryId=${territoryId}`,
    );
    return res?.data;
  } catch (err) {
    return 0;
  }
};

// Last Added | Total Sales API
const getDashboardTotalSalesValue = async (
  accId,
  buId,
  territoryId,
  levelId,
) => {
  try {
    const res = await axios.get(
      `/rtm/PivotReport/GetTotalSales?AccountId=${accId}&BusinessUnitId=${buId}&LevelId=${levelId}&TerritoryId=${territoryId}`,
    );
    return res?.data;
  } catch (err) {
    return 0;
  }
};

// Last Added | Total Target API
const getDashboardTotalTargetValue = async (
  accId,
  buId,
  territoryId,
  levelId,
) => {
  try {
    const res = await axios.get(
      `/rtm/PivotReport/GetTotalTarget?AccountId=${accId}&BusinessUnitId=${buId}&LevelId=${levelId}&TerritoryId=${territoryId}`,
    );
    return res?.data;
  } catch (err) {
    return 0;
  }
};

export const GetDashBoardData_api = async (
  accId,
  buId,
  empId,
  reportdate,
  territoryId,
  levelId,
  setInfoArry,
  infoArry,
  setLoading,
  setTargetInfo,
) => {
  setLoading && setLoading(true);

  try {
    let res = await axios.get(
      `/rtm/DashBoard/GetDashBoardData?accountid=${accId}&BusinessUnitId=${buId}&EmployeeId=${empId}&reportdate=${reportdate}&territoryId=${territoryId}`,
    );
    if (res?.status === 200) {
      const totalSales = await getDashboardTotalSalesValue(
        accId,
        buId,
        territoryId,
        levelId,
      );
      const totalTarget = await getDashboardTotalTargetValue(
        accId,
        buId,
        territoryId,
        levelId,
      );

      const ADS = await getDashboardADSValue(accId, buId, territoryId, levelId); // LastChange
      const ADT = await getADTDashboardValue(accId, buId, territoryId, levelId);

      const averageAchievement = ADT === 0 ? 0 : (ADS / ADT) * 100 || 0;

      const RWD = +res?.data?.calendardata?.remainingDays || 0;

      setLoading && setLoading(false);
      const copyData = [...infoArry];

      //TWD
      copyData[0] = {
        ...copyData[0],
        amount: `${res?.data?.calendardata?.workDays || 0}`,
        isShow: false,
      };

      //DWD
      copyData[1] = {
        ...copyData[1],
        amount: `${res?.data?.calendardata?.doneWorkingDays || 0}`,
        isShow: false,
      };

      //RWD
      copyData[2] = {
        ...copyData[2],
        amount: `${RWD || 0}`,
        isShow: false,
      };

      // Total Target | API Include
      copyData[3] = {
        ...copyData[3],
        amount: `৳${totalTarget.toFixed(0) || 0}`,
        key: 'totalTarget',
        pageTitle: 'Total Target Report',
        isShow: true,
      };

      // Total Sales | API Include
      copyData[4] = {
        ...copyData[4],
        amount: `৳${totalSales?.toFixed(0) || 0}`,
        key: 'totalSales',
        pageTitle: 'Total Sales Report',
        isShow: true,
      };

      // ADS | API Include
      copyData[5] = {
        ...copyData[5],
        amount: `৳${ADS?.toFixed(0)}`,
        isShow: true,
      };

      // Average Achievement
      copyData[6] = {
        ...copyData[6],
        amount: `${averageAchievement?.toFixed(2)}%`,
        isShow: true,
      };
      setInfoArry(copyData);

      // TargetInfo set
      const RT = +totalTarget - +totalSales;
      const todayTarget = +RT / +RWD > 0 ? +RT / +RWD : 0;
      const nextTarget = +RT / (+RWD + 1) > 0 ? +RT / (+RWD + 1) : 0;
      setTargetInfo({
        todayTarget:
          todayTarget === Infinity || todayTarget === null
            ? 0
            : todayTarget?.toFixed(0) || 0,
        nextTarget:
          nextTarget === Infinity || nextTarget === null
            ? 0
            : nextTarget?.toFixed(0) || 0,
      });
    }
  } catch (err) {
    setLoading && setLoading(false);
  }
};

export const GetTargetAchivement_api = async (
  accId,
  buId,
  empId,
  reportdate,
  setter,
  setLoading,
) => {
  setLoading && setLoading(true);
  try {
    let res = await axios.get(
      `/rtm/KPI/GetTargetAchivementById?accountid=${accId}&BusinessUnitId=${buId}&Employeeid=${empId}&reportdate=${reportdate}`,
    );
    if (res?.status === 200) {
      setLoading && setLoading(false);
      setter(res?.data);
    }
  } catch (err) {
    setLoading && setLoading(false);
    if (err?.response?.status === 500) {
    }
  }
};

export const GetEmployeeRanking_api = async (
  accId,
  buId,
  employeeId,
  levelId,
  territoryId,
  setEmployeeRanking,
  setLoading,
) => {
  setLoading && setLoading(true);
  try {
    let res = await axios.get(
      `/rtm/RTMSalesReport/GetEmployeeRankingReportDashboard?AccountId=${accId}&BusinessUnitId=${buId}&LevelId=${levelId}&EmployeeId=${employeeId}&TerritoryId=${territoryId}`,
    );
    if (res?.status === 200) {
      setLoading && setLoading(false);
      setEmployeeRanking({
        totalRanking: res?.data?.total,
        employeePosition: res?.data?.rank,
      });
    }
  } catch (err) {
    setLoading && setLoading(false);
    setEmployeeRanking({
      totalRanking: 0,
      employeePosition: 0,
    });
  }
};

export const GetTourData = async (empId, fromDate, setter, setLoading) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/rtm/RoutePlan/RoutePlanByLocation?employeeId=${empId}&FromDate=${fromDate}`,
    );

    setLoading && setLoading(false);
    setter(res?.data);
  } catch (err) {
    setLoading && setLoading(false);
    if (err?.response?.status === 500) {
    }
  }
};

export const getTodaySales = async (accId, buId, empId, date, setter) => {
  try {
    const res = await axios.get(
      `/rtm/DashBoard/GetTodaySalesAmount?accountid=${accId}&BusinessUnitId=${buId}&EmployeeId=${empId}&reportdate=${date}`,
    );
    setter(res?.data);
  } catch (err) {}
};

export const GetOutletVisitData = async (
  accId,
  buId,
  date,
  levelId,
  territoryId,
  setter,
) => {
  try {
    const res = await axios.get(
      `/rtm/DashBoard/GetOutletVisit?accountId=${accId}&businessUnitId=${buId}&date=${date}&level=${levelId}&Territory=${territoryId}`,
    );
    setter(res?.data);
  } catch (err) {}
};

export const getSalesReport = async (accId, buId, empId, date, setter) => {
  try {
    const res = await axios.get(
      `/rtm/RTMSalesReport/GetSOSalesPerformance?AccountId=${accId}&BusinessId=${buId}&EmployeeId=${empId}&inquiryDate=${date}`,
    );
    setter(res?.data);
  } catch (err) {}
};

export const getStrikeRateValue = async (
  accId,
  buId,
  fromData,
  toDate,
  lvId,
  tId,
  setter,
) => {
  try {
    const res = await axios.get(
      `/rtm/RTMCommonProcess/GetSalesTargetByAchievementForDashBoard?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${fromData}&Todate=${toDate}&LevelId=${lvId}&TerritoryId=${tId}`,
    );
    setter(res?.data);
  } catch (err) {
    setter(0);
  }
};

// User Log Info Save API
export const createUserLogInfo = async (payload) => {
  try {
    const res = await axios.post(
      '/rtm/RTMCommonProcess/CreateUserLogInfo',
      payload,
    );
    if (res?.status === 200 && res?.data) {
    }
  } catch (err) {}
};
