import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import CommonTopBar from '../../../../../common/components/CommonTopBar';
import ICustomPicker from '../../../../../common/components/ICustomPicker';
import {Formik} from 'formik';
import FormInput from '../../../../../common/components/TextInput';
import {getRetailOrderById, getViewInfobyOrder} from '../helper';
import Row from '../../../../../common/components/Row';
import Col from '../../../../../common/components/Col';

let initValues = {
  territory: '',
  distributorName: '',
  route: '',
  beat: '',
  outlet: '',
  distributionChannel: '',
  advanceAmount: '0',
  totalOrderAmount: '0',
};

function ViewSecondaryOrder({route: {params}, navigation}) {
  const [singleData, setSingleData] = useState([]);
  const [items, setItems] = useState([]);
  useEffect(() => {
    // if (params?.id) {
    //   getViewInfobyOrder(params?.id, setSingleData, setItems);
    // }

    if (params?.id) getRetailOrderById(params?.id, setSingleData, setItems);

  }, []);

  return (
    <>
      <ScrollView contentContainerStyle={{backgroundColor: '#ffffff', flex: 1}}>
        <CommonTopBar />

        {/* drop down section */}
        <Formik
          enableReinitialize={true}
          initialValues={params?.id ? singleData : initValues}
          onSubmit={(values, actions) => {
            actions.resetForm();
          }}>
          {(formikprops) => (
            <View
              style={{marginHorizontal: 10, marginBottom: 55, paddingTop: 20}}>
              <ScrollView>
                {/* <ICustomPicker
                  label="Territory Name"
                  name="territory"
                  formikProps={formikprops}
                  disabled={true}
                /> */}
                {/* <ICustomPicker
                  label="Distributor Name"
                  name="distributorName"
                  formikProps={formikprops}
                  disabled={true}
                /> */}
                {/* <ICustomPicker
                  label="Route Name"
                  name="route"
                  formikProps={formikprops}
                  disabled={true}
                />

                <ICustomPicker
                  label="Market Name"
                  name="beat"
                  formikProps={formikprops}
                  disabled={true}
                /> */}
                <ICustomPicker
                  label="Outlet Name"
                  name="outlet"
                  formikProps={formikprops}
                  disabled={true}
                />

                {/* <ICustomPicker
                  label="Distribution Channel"
                  name="distributionChannel"
                  formikProps={formikprops}
                  disabled={true}
                /> */}

                <FormInput
                  name="advanceAmount"
                  label="Advance Amount"
                  formikProps={formikprops}
                  disabled={true}
                />
                <FormInput
                  // value={getTotalAmount() || '0'}
                  name="totalOrderAmount"
                  label="Total Order Amount"
                  formikProps={formikprops}
                  disabled={true}
                />

                <Row colGap={1} style={{marginBottom: 8}}>
                  <Col width="25%">
                    <TouchableOpacity
                      onPress={() => {
                        console.log(JSON.stringify(items, null, 2));
                        navigation.navigate('Free Items', {
                          values: {...formikprops?.values},
                          items: items,
                          id: params?.id,
                        });
                      }}>
                      <Text style={styles.btnText}>Free Items</Text>
                    </TouchableOpacity>
                  </Col>
                </Row>

                {/* product category */}

                <View
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 7,
                    marginBottom: 10,
                    paddingVertical: 10,
                    elevation: 3,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}>
                    <View style={{width: 100}}>
                      <Text style={{fontWeight: 'bold'}}>Product</Text>

                      <Text style={{fontWeight: 'bold'}}>Rate</Text>
                    </View>
                    <View style={{width: 120}}>
                      <Text style={{fontWeight: 'bold'}}>Quantity</Text>
                    </View>
                  </View>
                </View>

                <View>
                  {items?.map((item, index) => (
                    <View
                      key={index}
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: 7,
                        marginBottom: 10,
                        paddingVertical: 10,
                        elevation: 3,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-around',
                        }}>
                        <View style={{width: 100}}>
                          <Text style={{fontWeight: 'bold'}}>
                            {item?.productName}
                          </Text>

                          <Text style={{fontWeight: 'bold'}}>
                            {/* Assign By Iftakhar Bhai */}
                            Rate:
                            {item?.price?.toFixed(3)
                              ? item?.price?.toFixed(3)
                              : item?.price}
                          </Text>
                        </View>
                        <View style={{width: 120}}>
                          <Text style={{fontWeight: 'bold'}}>
                            {item?.orderQuantity}
                          </Text>
                          {/* <Text style={{fontWeight: 'bold'}}>
                            Amount: {item?.orderAmount}
                          </Text> */}
                          {/* <Text style={{fontWeight: 'bold'}}>
                            UOM:{item?.uomname}
                          </Text> */}
                        </View>
                      </View>
                    </View>
                  ))}
                </View>

                {/* <CustomButton
                  onPress={formikprops.handleSubmit}
                  btnTxt="Save"
                /> */}
              </ScrollView>
            </View>
          )}
        </Formik>
      </ScrollView>
    </>
  );
}

export default ViewSecondaryOrder;
const styles = StyleSheet.create({
  availableBalanceSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  availableBalanceAmount: {
    color: '#2ED573',
    fontSize: 25,
    fontWeight: 'bold',
  },
  divider: {
    backgroundColor: '#DFDFDF',
    height: 2,
  },
  teritoryStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginTop: 20,
  },
  selectItemStyle: {
    flexDirection: 'row',

    justifyContent: 'space-between',
    backgroundColor: '#DFDFDF',
    height: 30,
    padding: 5,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  notSelectedStyle: {
    flexDirection: 'row',

    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    height: 30,
    padding: 5,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  categoryText: {
    margin: 10,
    fontWeight: 'bold',
    fontSize: 15,
  },
  textInputView: {
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: 'row',
    height: 20,
  },
  textInputStyle: {
    width: 30,
    fontSize: 14,
    paddingVertical: -5,
    textAlignVertical: 'top',
  },
  selectItemBar: {
    backgroundColor: '#DFDFDF',
    height: 2,
    borderBottomRightRadius: 26,
    borderBottomLeftRadius: 26,
  },
  btnStyle: {
    backgroundColor: '#3A405A',
    position: 'absolute',
    top: '80%',
    left: '10%',
    alignItems: 'center',
    // marginHorizontal: '7%',
    // marginVertical: 15,
    width: '80%',
    flexDirection: 'row',
    height: 50,

    borderRadius: 25,
    justifyContent: 'space-evenly',
  },
  btnCircle: {
    width: 25,
    height: 25,
    backgroundColor: '#3A405A',
    borderRadius: 15,
    marginHorizontal: 5,
    borderColor: '#fff',
    borderWidth: 2,
  },
  btnText: {
    fontSize: 12,
    borderRadius: 5,
    padding: 5,
    paddingVertical: 7,
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: '#00cdac',
    // fontFamily: 'HelveticaNeue Light',
    textAlign: 'center',
  },
});
