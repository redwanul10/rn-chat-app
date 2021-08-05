export const routeSelectByDefault = (
  territoryInfo,
  routeDDL,
  afterWhatCallback,
) => {
  if (territoryInfo?.todayRouteId) {
    const check = routeDDL?.filter(
      (item) => item?.value === territoryInfo?.todayRouteId,
    );

    if (check?.length > 0) {
      afterWhatCallback(check[0] || '');
    }
  }
};
