import React, { useState, useEffect, useContext } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import CommonTopBar from '../../../../../common/components/CommonTopBar';
import ICustomPicker from '../../../../../common/components/ICustomPicker';
import IDatePicker from '../../../../../common/components/IDatePicker';
import { Formik } from 'formik';
import CustomButton from '../../../../../common/components/CustomButton';
import { GlobalState } from '../../../../../GlobalStateProvider';
import { _dateFormatter } from '../../../../../common/functions/_dateFormatter';
import {
  getTerritoryDDL,
  getDistributorDDL,
  getRetailOrderDirectDeliveryLandingData,
} from '../helper';
import Row from '../../../../../common/components/Row';
import Col from '../../../../../common/components/Col';

initValues = {
  territory: '',
  distributor: '',
  fromDate: '',
  toDate: '',
};

function RetailOrderDirectDelivery({ navigation }) {
  const { profileData, selectedBusinessUnit } = useContext(GlobalState);
  const [territoryDDL, setTerritoryDDL] = useState([]);
  const [distributorDDL, setDistributorDDL] = useState([]);
  const [landingData, setLandingData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTerritoryDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setTerritoryDDL,
    );
  }, [profileData, selectedBusinessUnit]);
  const viewHandler = (values) => {
    getRetailOrderDirectDeliveryLandingData(
      values?.fromDate,
      values?.toDate,
      values?.distributor?.value,
      setLandingData,
      setLoading,
    );
  };


  return (
    <>
      <ScrollView>
        <CommonTopBar />
        <Formik
          enableReinitialize={true}
          initialValues={{ ...initValues }}
          //   validationSchema={schemaValidation}
          onSubmit={(values, actions) => {
            viewHandler(values, () => {
              actions.resetForm();
            });
          }}>
          {(formikprops) => (
            <View style={{ marginHorizontal: 10, marginTop: 20 }}>

              <Row colGap={5}>
                <Col width="50%">
                  <ICustomPicker
                    label="Territory Name"
                    name="territory"
                    options={territoryDDL}
                    onChange={(item) => {
                      formikprops.setFieldValue('territory', item);
                      getDistributorDDL(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        item?.value,
                        setDistributorDDL,
                      );
                    }}
                    formikProps={formikprops}
                  />
                </Col>
                <Col width="50%">
                  <ICustomPicker
                    label="Distributor"
                    name="distributor"
                    options={distributorDDL}
                    formikProps={formikprops}
                  /></Col>
                <Col width="50%">
                  <IDatePicker
                    label="From Date"
                    name="fromDate"
                    formikProps={formikprops}
                  /></Col>
                <Col width="50%">
                  <IDatePicker
                    label="To Date"
                    name="toDate"
                    formikProps={formikprops}
                  /></Col>
              </Row>





              <CustomButton
                onPress={formikprops.handleSubmit}
                isLoading={loading}
                btnTxt="View"
              />

              <View
                style={{
                  marginVertical: 10,
                  padding: 10,
                  // marginHorizontal: 10,
                  borderRadius: 5,
                  backgroundColor: '#ffffff',
                }}>
                <View
                  style={[styles.cardStyle, { justifyContent: 'space-between' }]}>
                  <Text style={{ fontWeight: 'bold' }}>SL</Text>
                </View>
                <View
                  style={[styles.cardStyle, { justifyContent: 'space-between' }]}>
                  <Text style={styles.customerAmount}>Delivery Date</Text>
                  <Text style={[styles.customerAmount, { color: '#00B44A' }]}>
                    Receive Amount
                  </Text>
                </View>
                <View
                  style={[
                    styles.cardStyle,
                    { marginBottom: 5, justifyContent: 'space-between' },
                  ]}>
                  <Text style={styles.teritoryText}>Total Delivery Amount</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={[styles.teritoryText, { paddingRight: 10 }]}>
                      Due
                    </Text>
                    <Text style={styles.teritoryText}>Qty</Text>
                  </View>
                </View>
              </View>
              {landingData?.data?.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() =>
                    navigation.navigate('Create Retail Order Direct Delivery', {
                      id: item?.delivaryId,
                      ...formikprops?.values,
                    })
                  }
                  style={{
                    marginVertical: 10,
                    padding: 10,
                    // marginHorizontal: 10,
                    borderRadius: 5,
                    backgroundColor: '#ffffff',
                  }}>
                  <View
                    style={[
                      styles.cardStyle,
                      { justifyContent: 'space-between' },
                    ]}>
                    <Text style={{ fontWeight: 'bold' }}>{item?.sl}</Text>
                  </View>
                  <View
                    style={[
                      styles.cardStyle,
                      { justifyContent: 'space-between' },
                    ]}>
                    <Text style={styles.customerAmount}>
                      {_dateFormatter(item?.delivaryDate)}
                    </Text>
                    <Text style={[styles.customerAmount, { color: '#00B44A' }]}>
                      {item?.receiveAmount}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.cardStyle,
                      { marginBottom: 5, justifyContent: 'space-between' },
                    ]}>
                    <Text style={styles.teritoryText}>
                      {item?.totalDeliveryAmount}
                    </Text>

                    <View style={{ flexDirection: 'row' }}>
                      <Text style={[styles.teritoryText, { paddingRight: 10 }]}>
                        {item?.dueAmount}
                      </Text>
                      <Text style={styles.teritoryText}>{item?.qty}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </Formik>
      </ScrollView>
    </>
  );
}

export default RetailOrderDirectDelivery;
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F4F6FC',
    flex: 1,
  },
  createButton: {
    marginRight: 50,
    padding: 6,
    backgroundColor: '#6c757d',
    borderRadius: 7,
    alignItems: 'center',
    width: 70,
  },
  box: {
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: '#ffffff',

    elevation: 5,
    // padding: 9,
    // paddingLeft: 12,
  },
  label: {
    fontSize: 14,
    // fontFamily: 'Rubik-Regular',
    color: '#636363',
  },
  customerAmount: {
    fontWeight: 'bold',
    fontSize: 17,
  },

  cardStyle: {
    flexDirection: 'row',
  },
  teritoryText: {
    color: '#000000',
    // paddingRight: 10,
    paddingVertical: 5,
    opacity: 0.75,
  },
  completeButton: {
    marginLeft: 10,
    backgroundColor: '#D1FFDF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#D2D2D2',
  },
  fabStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    position: 'absolute',
    bottom: 55,
    right: 17,
    height: 60,
    backgroundColor: '#3A405A',
    borderRadius: 100,
  },
  dateStyle: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 7,
    height: 40,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
