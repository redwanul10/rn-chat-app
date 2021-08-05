import React, {useEffect, useState, useContext} from 'react';
import {ScrollView, StyleSheet, View, Text} from 'react-native';
import CommonTopBar from '../../../../common/components/CommonTopBar';
import {GlobalState} from '../../../../GlobalStateProvider';
import {getLandingData} from './helper';
import * as Yup from 'yup';
import Row from '../../../../common/components/Row';
import Col from '../../../../common/components/Col';
import {globalStyles} from '../../../../common/globalStyle/globalStyles';
import MiniButton from '../../../../common/components/MiniButton';
import {useFormik} from 'formik';
import FormInput from '../../../../common/components/TextInput';
import {Spinner} from 'native-base';

let timeout;

const RegisterOutletApproval = ({navigation, route: {params}}) => {
  const {profileData, selectedBusinessUnit} = useContext(GlobalState);
  const [loading, setIsLoading] = useState(false);
  const [landingData, setLandingData] = useState([]);

  const formikprops = useFormik({
    enableReinitialize: true,
    initialValues: {search: ''},
    onSubmit: (values, actions) => {
      viewHandler(values, () => {
        actions.resetForm();
      });
    },
  });

  useEffect(() => {
    getLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      profileData?.employeeId,
      setLandingData,
      setIsLoading,
    );
  }, []);

  const handleSearch = (searchValue) => {
    formikprops?.setFieldValue('search', searchValue);

    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      getLandingData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        profileData?.employeeId,
        setLandingData,
        setIsLoading,
        searchValue,
      );
    }, 1000);
  };

  return (
    <>
      <CommonTopBar />

      <ScrollView
        contentContainerStyle={{paddingHorizontal: 10, paddingTop: 10}}>
        <>
          <View>
            <ScrollView>
              <Row>
                <Col width="100%">
                  <FormInput
                    name="search"
                    label="Search"
                    formikProps={formikprops}
                    placeholder="Search by Phone or Code"
                    onChangeText={handleSearch}
                  />
                </Col>
              </Row>
              <View style={globalStyles.cardStyle}>
                <Row colGap={5}>
                  <Col width={'50%'}>
                    <Text style={styles.customerAmount}>Outlet Name</Text>

                    <Text style={styles.teritoryText}>Outlet Type Name</Text>
                    <Text style={styles.teritoryText}>Code</Text>
                    <Text style={{textAlign: 'left'}}>Mobile Number</Text>
                  </Col>
                  <Col width={'50%'}>
                    <View>
                      <Text
                        style={{
                          textAlign: 'right',
                          color: 'black',
                          fontWeight: 'bold',
                        }}>
                        Owner Name
                      </Text>
                      <Text
                        style={[
                          styles.customerAmount,
                          {
                            color: '#00B44A',
                            textAlign: 'right',
                            fontSize: 15,
                          },
                        ]}>
                        Outlet Address
                      </Text>
                    </View>
                    <MiniButton disabled={true} btnText="View" />
                  </Col>
                </Row>
              </View>

              {loading && <Spinner color="black" />}

              {!loading &&
                landingData?.data?.map((item, index) => (
                  <View style={globalStyles.cardStyle}>
                    <Row colGap={5}>
                      <Col width={'50%'}>
                        <Text style={styles.customerAmount}>
                          {item?.outletName}
                        </Text>

                        <Text style={styles.teritoryText}>
                          {item?.businessTypeName}
                        </Text>
                        <Text>{item?.outletCode}</Text>
                        <Text>{item?.mobileNumber}</Text>
                      </Col>
                      <Col width={'50%'}>
                        <View>
                          <Text
                            style={{
                              textAlign: 'right',
                              color: 'black',
                              fontWeight: 'bold',
                            }}>
                            {item?.ownerName}
                          </Text>
                          <Text
                            style={[
                              styles.customerAmount,
                              {
                                color: '#00B44A',
                                textAlign: 'right',
                                fontSize: 15,
                              },
                            ]}>
                            {item?.outletAddress}
                          </Text>
                        </View>
                        <MiniButton
                          onPress={() => {
                            navigation.navigate('Approve Register Outlet', {
                              id: item?.outletId,
                            });
                          }}
                          btnText="View"
                        />
                      </Col>
                    </Row>
                  </View>
                ))}
            </ScrollView>
          </View>
        </>
      </ScrollView>
    </>
  );
};

export default RegisterOutletApproval;

const styles = StyleSheet.create({
  customerAmount: {
    fontWeight: 'bold',
    fontSize: 17,
  },

  cardStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  teritoryText: {
    color: '#000000',
    paddingRight: 10,
    paddingVertical: 5,
    opacity: 0.75,
  },
});
