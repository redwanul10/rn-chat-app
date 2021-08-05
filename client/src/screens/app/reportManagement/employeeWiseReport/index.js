/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState} from 'react';
import {ScrollView, StyleSheet, View, Text} from 'react-native';
import CommonTopBar from '../../../../common/components/CommonTopBar';
import {useFormik} from 'formik';
import {GlobalState} from '../../../../GlobalStateProvider';
import CustomButton from '../../../../common/components/CustomButton';
import Row from '../../../../common/components/Row';
import Col from '../../../../common/components/Col';
import IDatePicker from '../../../../common/components/IDatePicker';
import {_todayDate} from '../../../../common/functions/_todayDate';
import {getLandingData} from './helper';
import NoDataFoundGrid from '../../../../common/components/NoDataFoundGrid';
import {_dateFormatter} from '../../../../common/functions/_dateFormatter';
import {globalStyles} from '../../../../common/globalStyle/globalStyles';

const initValues = {
  date: _todayDate(),
};

function EmployeeWiseReport({navigation}) {
  const {profileData, selectedBusinessUnit} = useContext(GlobalState);
  const [landingData, setLandingData] = useState();
  const [loading, setLoading] = useState(false);

  // Formiks Setup
  const formikprops = useFormik({
    enableReinitialize: true,
    initialValues: initValues,
    onSubmit: (values, actions) => {
      viewHandler(values);
    },
  });

  const viewHandler = (values) => {
    getLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      profileData?.employeeId,
      formikprops?.values?.date,
      setLandingData,
      setLoading,
    );
  };

  return (
    <>
      <ScrollView>
        <CommonTopBar title={'Employee Wise Report'} />
        <>
          <View style={{paddingHorizontal: 10, marginTop: 5}}>
            <ScrollView>
              <Row colGap={5}>
                <Col width="50%">
                  <IDatePicker
                    label="Date"
                    name="date"
                    onChange={(selectedDate) => {
                      formikprops.setFieldValue(
                        'date',
                        _dateFormatter(selectedDate),
                      );
                    }}
                    formikProps={formikprops}
                  />
                </Col>
                <Col width="100%">
                  <CustomButton
                    onPress={formikprops.handleSubmit}
                    isLoading={loading}
                    btnTxt="View"
                  />
                </Col>
              </Row>

              <>
                {landingData?.length > 0 ? (
                  <>
                    <Row style={[styles.cardStyle]}>
                      <Col style={{width: '50%'}}>
                        <Text style={{fontWeight: 'bold'}}>
                          Total Employee: {landingData?.length || 0}
                        </Text>
                      </Col>
                    </Row>

                    <Row style={[styles.cardStyle]}>
                      <Col style={{width: '50%'}}>
                        <Text style={[styles.employeeName]}>Employee Name</Text>
                        <Text
                          style={[
                            {
                              color: 'black',
                            },
                            globalStyles.fontSizeMini,
                          ]}>
                          Location Name
                        </Text>
                      </Col>

                      <Col
                        style={{
                          width: '25%',
                          alignItems: 'flex-end',
                        }}>
                        <Text
                          style={[
                            {
                              color: 'black',
                              fontWeight: 'bold',
                              textAlign: 'left',
                            },
                            globalStyles.fontSizeMicro,
                          ]}>
                          Order Qty/psc
                        </Text>
                      </Col>

                      <Col
                        style={{
                          width: '25%',
                          alignItems: 'flex-end',
                        }}>
                        <Text
                          style={[
                            {
                              color: 'green',
                              fontWeight: 'bold',
                            },
                            globalStyles.fontSizeMicro,
                          ]}>
                          Amount
                        </Text>
                      </Col>
                    </Row>
                  </>
                ) : null}

                {/* Grid Data */}
                <View style={{paddingBottom: 10}}>
                  {landingData?.map((item, index) => (
                    <Row key={index} style={[styles.cardStyle]}>
                      <Col style={{width: '50%'}}>
                        <Text style={styles.employeeName}>
                          {item?.employeeName}
                        </Text>

                        <Text
                          style={[
                            {
                              color: 'black',
                            },
                            globalStyles.fontSizeMini,
                          ]}>
                          {item?.territoryName}
                        </Text>
                      </Col>

                      <Col
                        style={{
                          width: '25%',
                          alignItems: 'flex-end',
                        }}>
                        <Text
                          style={[
                            {
                              color: 'black',
                              fontWeight: 'bold',
                              textAlign: 'center',
                            },
                            globalStyles.fontSizeMicro,
                          ]}>
                          {item?.orderQuantity.toFixed(0)
                            ? item?.orderQuantity.toFixed(0)
                            : item?.orderQuantity}
                        </Text>
                      </Col>
                      <Col
                        style={{
                          width: '25%',
                          alignItems: 'flex-end',
                        }}>
                        <Text
                          style={[
                            {
                              color: 'green',
                              fontWeight: 'bold',
                            },
                            globalStyles.fontSizeMicro,
                          ]}>
                          {item?.orderAmount.toFixed(0)
                            ? item?.orderAmount.toFixed(0)
                            : item?.orderAmount}
                        </Text>
                      </Col>
                    </Row>
                  ))}
                </View>
              </>
            </ScrollView>
          </View>
          {landingData?.length === 0 && <NoDataFoundGrid />}
        </>
      </ScrollView>
    </>
  );
}

export default EmployeeWiseReport;

const styles = StyleSheet.create({
  cardStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
  employeeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});
