import React, {useState, useEffect, useContext} from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import {Formik} from 'formik';
import CommonTopBar from '../../../../common/components/CommonTopBar';
import {getSalesCollectionLandingData, getRouteDDL} from './helper';
import {GlobalState} from '../../../../GlobalStateProvider';
import {useIsFocused} from '@react-navigation/native';
import CustomButton from '../../../../common/components/CustomButton';
import IDatePicker from '../../../../common/components/IDatePicker';
import FabButton from '../../../../common/components/FabButton';
import {_todayDate} from '../../../../common/functions/_todayDate';
import MiniButton from '../../../../common/components/MiniButton';

const initValues = {
  route: '',
  reportType: '',
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

function SalesCollection({navigation}) {
  const {profileData, selectedBusinessUnit} = useContext(GlobalState);
  const [routeDDL, setRouteDDL] = useState([]);
  const [landingData, setLandingData] = useState([]);
  const [loading, setLoading] = useState(false);

  const isFocused = useIsFocused();
  useEffect(() => {
    getRouteDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setRouteDDL,
    );
  }, [profileData, selectedBusinessUnit]);

  const viewHandler = (values) => {
    getSalesCollectionLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.fromDate,
      values?.toDate,
      setLandingData,
      setLoading,
    );
  };

  return (
    <>
      <ScrollView contentContainerStyle={{backgroundColor: '#F4F6FC'}}>
        <CommonTopBar />
        <Formik
          enableReinitialize={true}
          initialValues={{...initValues}}
          onSubmit={(values, actions) => {
            viewHandler(values, () => {
              actions.resetForm();
            });
          }}>
          {(formikprops) => (
            <View style={{marginHorizontal: 10, marginTop: 10}}>
              <IDatePicker
                label="From Date"
                name="fromDate"
                formikProps={formikprops}
              />
              <IDatePicker
                label="To Date"
                name="toDate"
                formikProps={formikprops}
              />

              <CustomButton
                onPress={formikprops.handleSubmit}
                isLoading={loading}
                btnTxt="Show"
              />
            </View>
          )}
        </Formik>

        <View
          style={{
            marginHorizontal: 10,
            marginVertical: 10,
            backgroundColor: '#ffffff',
            padding: 5,
            borderRadius: 7,
          }}>
          <View style={styles.cardStyle}>
            <Text style={{fontWeight: 'bold'}}>SL</Text>
          </View>
          <View style={[styles.cardStyle, {justifyContent: 'space-between'}]}>
            <Text style={styles.customerAmount}>Partner Name</Text>
            <Text style={[styles.customerAmount, {color: '#00B44A'}]}>
              Amount
            </Text>
          </View>
          <View style={[styles.cardStyle, {marginBottom: 5}]}>
            <Text style={styles.teritoryText}>Partner Address</Text>
          </View>
        </View>

        {landingData?.data?.map((item, index) => (
          <>
            {/* <TouchableOpacity
          onPress={() => {
            navigation.navigate('Retail Order Base Delivery View', {
              id: item?.deliveryId,
              orderNo: item?.orderId,
            });
          }}> */}
            <View
              key={index}
              style={{
                marginHorizontal: 10,
                marginBottom: 10,
                backgroundColor: '#ffffff',
                padding: 5,
                borderRadius: 7,
              }}>
              <View style={styles.cardStyle}>
                <Text style={{fontWeight: 'bold'}}>{item?.sl}</Text>
              </View>
              <View
                style={[styles.cardStyle, {justifyContent: 'space-between'}]}>
                <Text style={styles.customerAmount}>
                  {item?.businessPartnerName}
                </Text>
                <Text style={[styles.customerAmount, {color: '#00B44A'}]}>
                  {item?.amount}
                </Text>
              </View>
              <View style={[styles.cardStyle, {marginBottom: 5}]}>
                <Text style={styles.teritoryText}>
                  {item?.businessPartnerAddress}
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <MiniButton
                  containerStyle={{justifyContent: 'flex-start', marginTop: 0}}
                  onPress={() => {
                    navigation.navigate('Edit Sales Collection', {
                      id: item?.id,
                    });
                  }}
                  btnText={'Edit'}
                />
              </View>
              {/* <TouchableOpacity
              onPress={() => {
                navigation.navigate('Retail Order Base Delivery View', {
                  id: item?.deliveryId,
                  orderNo: item?.orderId,
                });
              }}
              style={styles.createButton}>
              <Text style={{color: '#ffffff'}}>Edit</Text>
            </TouchableOpacity> */}
            </View>
            {/* </TouchableOpacity> */}
          </>
        ))}
      </ScrollView>
      <FabButton
        onPress={() => navigation.navigate('Create Sales Collection')}
        // bgColor="#FFD34E"
      />
    </>
  );
}

export default SalesCollection;
const styles = StyleSheet.create({
  customerAmount: {
    fontWeight: 'bold',
    fontSize: 17,
  },

  cardStyle: {
    flexDirection: 'row',
  },
  teritoryText: {
    color: '#000000',
    paddingRight: 10,
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
  createButton: {
    marginRight: 50,
    padding: 6,
    backgroundColor: '#6c757d',
    borderRadius: 7,
    alignItems: 'center',
    width: 70,
  },
});
