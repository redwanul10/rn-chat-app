import React, {useState, useEffect, useContext} from 'react';
import {View, ScrollView, StyleSheet, Text, Image} from 'react-native';
import CommonTopBar from '../../../../../common/components/CommonTopBar';
import {Formik} from 'formik';

import ICustomPicker from '../../../../../common/components/ICustomPicker';
import FormInput from '../../../../../common/components/TextInput';

import {getOutletViewData} from '../helper';

import {GlobalState} from '../../../../../GlobalStateProvider';

import {_dateFormatter} from '../../../../../common/functions/_dateFormatter';
import {_todayDate} from '../../../../../common/functions/_todayDate';
import FilePicker from '../../../../../common/components/FilePicker';
import Col from '../../../../../common/components/Col';
import Row from '../../../../../common/components/Row';

function ViewOutletBillRequest({route: {params}}) {
  const {profileData, selectedBusinessUnit} = useContext(GlobalState);
  const [outletViewData, setOutletViewData] = useState([]);

  useEffect(() => {
    getOutletViewData(
      params?.outletBillId,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setOutletViewData,
    );
  }, []);
  return (
    <ScrollView>
      {/* <Text>{JSON.stringify(outletViewData, null, 2)}</Text> */}

      <CommonTopBar />

      <View style={{marginHorizontal: 10, marginTop: 10}}>
        <Formik
          enableReinitialize={true}
          initialValues={{
            ...outletViewData,
          }}>
          {(formikprops) => (
            <View>
              <FormInput
                label="Outlet Address"
                name="outletAddress"
                disabled={true}
                formikProps={formikprops}
              />
              <ICustomPicker
                label="Asset Name"
                name="itemName"
                disabled={true}
                formikProps={formikprops}
              />

              <FormInput
                label="Receive Quantity"
                name="receiveQty"
                disabled={true}
                formikProps={formikprops}
              />
              <FormInput
                label="Comments"
                name="commentsHeader"
                disabled={true}
                formikProps={formikprops}
              />
              <FormInput
                label="Bill Request Amount"
                name="billRequestAmount"
                disabled={true}
                formikProps={formikprops}
              />
              <FormInput
                label="Bill Request Date"
                name="billRequestDate"
                disabled={true}
                formikProps={formikprops}
              />

              <FormInput
                label="Comments"
                name="commentsCreate"
                disabled={true}
                placeholder="Comments"
                formikProps={formikprops}
              />

              <Row>
                <Col style={{justifyContent: 'center'}}>
                  <FilePicker disabled={true} isIconBtn={true} />
                </Col>
              </Row>
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
}

export default ViewOutletBillRequest;

const styles = StyleSheet.create({
  divider: {
    backgroundColor: '#AEAEAE',
    height: 1.5,
  },
  textError: {
    color: 'red',
  },
});
