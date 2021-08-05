import React, {useState, useEffect, useContext} from 'react';
import * as Yup from 'yup';
import {
  ScrollView,
  View,
  // Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import {useFormik} from 'formik';
import Row from '../../../../common/components/Row';
import Col from '../../../../common/components/Col';
import CommonTopBar from '../../../../common/components/CommonTopBar';
import ICustomPicker from '../../../../common/components/ICustomPicker';
import CustomButton from '../../../../common/components/CustomButton';
import {GlobalState} from '../../../../GlobalStateProvider';
import {_dateFormatter} from '../../../../common/functions/_dateFormatter';
import FabButton from '../../../../common/components/FabButton';
import {_todayDate} from '../../../../common/functions/_todayDate';
// import {getRouteDDLByTerritoryId} from '../../../../common/actions/helper';
import {
  getRouteDDL,
  getLandingData,
  assetReceiveApprovalList_api,
} from './helper';
import NoDataFoundGrid from '../../../../common/components/NoDataFoundGrid';
import ICheckbox from '../../../../common/components/ICheckbox';
import Text from '../../../../common/components/IText';
import {globalStyles} from '../../../../common/globalStyle/globalStyles';
import {routeSelectByDefault} from '../../../../common/functions/routeSelectedByDefault';

const validationSchema = Yup.object().shape({
  route: Yup.object().shape({
    label: Yup.string().required('Route is required'),
    value: Yup.string().required('Route is required'),
  }),
});

const initValues = {
  route: '',
};

function AssetReceive({navigation}) {
  const {profileData, selectedBusinessUnit, territoryInfo} = useContext(
    GlobalState,
  );
  const [loading, setLoading] = useState(false);
  const [loadingReceive, setLoadingReceive] = useState(false);
  const [landingData, setLandingData] = useState([]);
  const [checkBox, setCheckBox] = useState(false);
  const [approval, Setapproval] = useState(true);

  // DDL State

  const [routeDDL, setRouteDDL] = useState([]);

  // Formiks Setup
  const formikprops = useFormik({
    enableReinitialize: true,
    initialValues: {...initValues},
    validationSchema: validationSchema,
    onSubmit: (values, actions) => {
      viewHandler(values, () => {
        actions.resetForm();
      });
    },
  });

  useEffect(() => {
    getRouteDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setRouteDDL,
    );
  }, [profileData, selectedBusinessUnit]);

  const viewHandler = (values) => {
    getLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.route?.value,
      setLoading,
      setLandingData,
    );
  };
  const setCallback = () => {
    setCheckBox(false);
  };

  // Select Single Item
  const selectIndividualItem = (index) => {
    let newRowdata = [...landingData?.data];
    newRowdata[index].isSelect = !newRowdata[index].isSelect;
    setLandingData({
      currentPage: landingData?.currentPage,
      data: newRowdata,
      pageSize: landingData?.pageSize,
      totalCount: landingData?.totalCount,
    });
    const approval = newRowdata.some((itm) => itm.isSelect === true);
    if (approval) {
      Setapproval(false);
    } else {
      Setapproval(true);
    }
  };

  // All item select
  const allGridCheck = (value) => {
    let newRowdata = [...(landingData?.data || [])];
    const modifyGridData = newRowdata?.map((itm) => ({
      ...itm,
      isSelect: value,
    }));
    setLandingData({
      currentPage: landingData?.currentPage,
      data: modifyGridData,
      pageSize: landingData?.pageSize,
      totalCount: landingData?.totalCount,
    });
    const approval = modifyGridData.some((itm) => itm?.isSelect === true);
    if (approval) {
      Setapproval(false);
    } else {
      Setapproval(true);
    }
  };

  // Approve Hanlder
  const approvalHandler = (values) => {
    const modifyFilterRowDto = landingData?.data?.filter(
      (itm) => itm?.isSelect === true,
    );

    const payload = modifyFilterRowDto?.map((itm) => ({
      rowId: itm?.rowId,
    }));

    assetReceiveApprovalList_api(payload, setLoadingReceive, () => {
      viewHandler(values);
      setCallback();
    });
  };

  // Last Added | By Default Route Selected | login info wise (territoryInfo?.todayRouteId)
  useEffect(() => {
    routeSelectByDefault(territoryInfo, routeDDL, (selectedRoute) => {
      formikprops?.setFieldValue('route', selectedRoute);
    });
  }, [routeDDL]);

  return (
    <>
      <ScrollView>
        <CommonTopBar />

        <View style={{marginHorizontal: 10, marginTop: 20}}>
          <Row colGap={5}>
            <Col width="100%">
              <ICustomPicker
                label="Route Name"
                name="route"
                options={routeDDL}
                formikProps={formikprops}
              />
            </Col>
          </Row>
          <Row colGap={5}>
            <Col width="50%">
              <CustomButton
                onPress={formikprops.handleSubmit}
                isLoading={loading}
                btnTxt="View"
              />
            </Col>
            <Col width="50%">
              <CustomButton
                // disabled={true ? checkBox === false : null}
                isLoading={loadingReceive}
                btnTxt="Receive"
                onPress={() => {
                  approvalHandler(formikprops?.values);
                }}
              />
            </Col>
          </Row>

          {/* Header Part */}
          <Row
            style={{
              marginVertical: 10,
              padding: 10,
              borderRadius: 5,
              backgroundColor: '#ffffff',
            }}>
            <Col width="60%">
              <Text style={[styles.customerAmount, globalStyles.fontSizeSmall]}>
                Outlet Name
              </Text>
              <Text style={[styles.address, globalStyles.fontSizeMicro]}>
                Outlet Address
              </Text>
              <Text
                style={[
                  styles.address,
                  globalStyles.fontSizeMicro,
                  {color: 'blue'},
                ]}>
                Market Name
              </Text>
              {landingData?.length > 0 ? (
                <ICheckbox
                  checked={checkBox}
                  onPress={(e) => {
                    setCheckBox(!checkBox);
                    allGridCheck(!checkBox);
                  }}
                />
              ) : (
                <Text></Text>
              )}
            </Col>

            <Col width="40%">
              <Text style={[styles.date, globalStyles.fontSizeMicro]}>
                Asset-Qty
              </Text>
              <Text style={[styles.date, globalStyles.fontSizeMicro]}>
                Item Name
              </Text>
              <Text
                style={[
                  styles.date,
                  globalStyles.fontSizeMicro,
                  {color: 'red'},
                ]}>
                Item Code
              </Text>
              <Text style={[styles.date, globalStyles.fontSizeMicro]}>
                Maintenance Cost
              </Text>
            </Col>
          </Row>

          {landingData?.data?.map((item, index) => (
            <TouchableOpacity
            // key={index}
            // onPress={() =>
            //   navigation.navigate('createAssetRequest', {
            //     id: item?.intAssetRequestId,
            //     ...formikprops?.values,
            //     type: 'view',
            //   })
            // }
            >
              <Row
                style={{
                  marginVertical: 10,
                  padding: 10,
                  borderRadius: 5,
                  backgroundColor: '#ffffff',
                }}>
                <Col width="60%">
                  <Text
                    style={[styles.customerAmount, globalStyles.fontSizeSmall]}>
                    {item?.outletName}
                  </Text>
                  <Text style={[styles.address, globalStyles.fontSizeMicro]}>
                    {item?.outletAddress}
                  </Text>
                  <Text
                    style={[
                      styles.address,
                      globalStyles.fontSizeMicro,
                      {color: 'blue'},
                    ]}>
                    {item?.beatName}
                  </Text>
                  <ICheckbox
                    checked={item?.isSelect}
                    onPress={() => {
                      selectIndividualItem(index);
                    }}
                  />
                </Col>
                <Col width="40%">
                  <Text style={[styles.date, globalStyles.fontSizeMicro]}>
                    {item?.assetQuantity}
                  </Text>
                  <Text style={[styles.date, globalStyles.fontSizeMicro]}>
                    {item?.itemName}
                  </Text>
                  <Text
                    style={[
                      styles.date,
                      globalStyles.fontSizeMicro,
                      {color: 'red'},
                    ]}>
                    {item?.itemCode}
                  </Text>
                  {item?.maintenneceCost === true ? (
                    <Text style={[styles.date, globalStyles.fontSizeMicro]}>
                      Yes
                    </Text>
                  ) : (
                    <Text style={[styles.date, globalStyles.fontSizeMicro]}>
                      No
                    </Text>
                  )}
                </Col>
              </Row>
            </TouchableOpacity>
          ))}
        </View>
        {landingData?.data?.length === 0 && <NoDataFoundGrid />}
      </ScrollView>
    </>
  );
}

export default AssetReceive;

const styles = StyleSheet.create({
  customerAmount: {
    fontWeight: 'bold',
  },
  date: {
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'right',
  },
  address: {color: '#00B44A', fontWeight: 'bold'},
});
