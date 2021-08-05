export const channelSelectedByDefault = (
  territoryInfo,
  channelDDL,
  afterWhatCallback,
) => {
  if (territoryInfo?.empChannelId) {
    const check = channelDDL?.filter(
      (item) => item?.value === territoryInfo?.empChannelId,
    );

    if (check?.length > 0) {
      afterWhatCallback(check[0] || '');
    }
  }
};
