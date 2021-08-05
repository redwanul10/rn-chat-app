import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {routeSelectByDefault} from '../../../../../common/functions/routeSelectedByDefault';
import ICustomPicker from '../../../../../common/components/ICustomPicker';
import CustomButton from '../../../../../common/components/CustomButton';
import Row from '../../../../../common/components/Row';
import Col from '../../../../../common/components/Col';
import {
  getTerritoryDDL,
  getRouteDDLByTerritoryId,
} from '../../../../../common/actions/helper';

const SearchForm = ({
  formikprops,
  loading,
  profileData,
  selectedBusinessUnit,
  territoryInfo,
}) => {
  // DDL State
  const [routeDDL, setRouteDDL] = useState([]);
  const [territoryDDL, setTerritoryDDL] = useState([]);

  useEffect(() => {
    getTerritoryDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      profileData?.employeeId,
      setTerritoryDDL,
    );
    console.log("updating component")
  }, [profileData, selectedBusinessUnit]);

  // Last Added | By Default Route Selected | login info wise (territoryInfo?.todayRouteId)
  useEffect(() => {
    routeSelectByDefault(territoryInfo, routeDDL, (selectedRoute) => {
      formikprops?.setFieldValue('route', selectedRoute);
    });
  }, [routeDDL]);

  return (
    <View style={{marginHorizontal: 10, marginTop: 10}}>
      <Row colGap={5}>
        <Col width="50%">
          <ICustomPicker
            label="Territory Name"
            name="territory"
            options={territoryDDL}
            onChange={(item) => {
              formikprops.setFieldValue('territory', item);
              formikprops.setFieldValue('route', '');
              getRouteDDLByTerritoryId(
                profileData?.accountId,
                selectedBusinessUnit?.value,
                item?.value,
                setRouteDDL,
              );
            }}
            formikProps={formikprops}
          />
        </Col>

        <Col width="50%">
          <ICustomPicker
            label="Route Name"
            name="route"
            options={routeDDL}
            formikProps={formikprops}
          />
        </Col>
      </Row>

      <CustomButton
        onPress={formikprops.handleSubmit}
        isLoading={loading}
        btnTxt="View"
      />
    </View>
  );
};

export default SearchForm;
