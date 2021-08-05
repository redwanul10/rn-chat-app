import React, {useState, useEffect, useContext} from 'react';
import {View,  ScrollView, StyleSheet} from 'react-native';
import CommonTopBar from '../../../../../common/components/CommonTopBar';
import {Formik} from 'formik';
import FormInput from '../../../../../common/components/TextInput';


import {
  getCreateDamageCollectionItemData,
  createDamageCollection,
  getMonthName,
} from '../helper';

import {GlobalState} from '../../../../../GlobalStateProvider';
import CustomButton from '../../../../../common/components/CustomButton';
import ICustomPicker from '../../../../../common/components/ICustomPicker';
import IDatePicker from '../../../../../common/components/IDatePicker';
import {_todayDate} from '../../../../../common/functions/_todayDate';
import {_dateFormatter} from '../../../../../common/functions/_dateFormatter';

import QuantityInputBox from '../../../../../common/components/QuantityInputBox';
import Row from '../../../../../common/components/Row';
import Col from '../../../../../common/components/Col';
import {Toast} from 'native-base';
import {
  getBeatDDL,
  getOutletNameDDL,
} from '../../../../../common/actions/helper';
import Text from '../../../../../common/components/IText';

function DamageCollectionForm({route: {params}}) {
  const {profileData, selectedBusinessUnit} = useContext(GlobalState);
  const [beatDDL, setBeatDDL] = useState([]);

  const [outletDDL, setOutletDDL] = useState([]);
  const [landingData, setLandingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  useEffect(() => {
    getBeatDDL(params?.route?.value, setBeatDDL);
  }, [profileData, selectedBusinessUnit]);

  const rowDtoHandler = (name, value, sl) => {
    let data = [...landingData];
    let _sl = data[sl];
    _sl[name] = value;
    setLandingData(data);
  };

  const viewHandler = (values) => {
    getCreateDamageCollectionItemData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.route?.value,
      values?.beat?.value,
      +values?.dEntryDate.split('-')[1],
      values?.damageCategoryHeader?.value,
      values?.distributorChannel?.value,
      values?.outlet?.value,
      values?.dEntryDate,
      setLoading,
      setLandingData,
    );
  };

  const saveHandler = (values, cb) => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      const filterLandingData = landingData?.filter(
        (item) => item?.damageCategory?.value,
      );
      if (filterLandingData?.length > 0) {
        const modfiData = filterLandingData?.map((itm) => {
          const ifDamageCategory = itm?.damageCategory?.value;
          return {
            rowId: itm?.rowId || 0,
            damageTypeId: ifDamageCategory
              ? itm?.damageCategory?.value || 0
              : 0,
            damageCategoryId: ifDamageCategory
              ? values?.damageCategoryHeader?.value || 0
              : 0,
            damageItemId: itm?.damageItemId || 0,
            damageItemName: itm?.damageItemName || '',
            damageTypeName: ifDamageCategory
              ? itm?.damageCategory?.label || ''
              : '',
            damageItemQty: ifDamageCategory ? +itm?.damageItemQty || 0 : 0,
            damageEntryId: itm?.damageEntryId || 0,
            replacementQty: 0,
            replacementItemId: itm?.damageItemId || 0,
            replacementItemName: itm?.damageItemName || '',
          };
        });
        const payload = {
          objHeader: {
            accountId: profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            territoryId: values?.territory?.value,
            routeId: values?.route?.value,
            beatId: values?.beat?.value,
            outletId: values?.outlet?.value,
            outletName: values?.outlet?.label,
            distributionChannelId: values?.distributorChannel?.value,
            distributionChannelName: values?.distributorChannel?.label,
            actionBy: profileData?.userId,
            damageEntryDate: values?.dEntryDate,
            damageEntryMonth: +values?.dEntryDate.split('-')[1],
            businessPartnerId: values?.distributorName?.value,
            dmgCategoryId: values?.damageCategoryHeader?.value,
            dmgCategoryName: values?.damageCategoryHeader?.label,
            damageEntryId: landingData[0]?.damageEntryId || 0,
          },
          objRow: modfiData,
        };
        createDamageCollection(payload, setLoadingSave);
      } else {
        Toast.show({
          text: 'Please add atleast one item',
          type: 'warning',
          duration: 3000,
        });
      }
    }
  };

  return (
    <>
      <ScrollView>
        <CommonTopBar />

        <Formik
          enableReinitialize={true}
          initialValues={
            params?.id
              ? singleData
              : {
                  ...params,
                  entryMonth: getMonthName(_todayDate()),
                  dEntryDate: _todayDate(),
                }
          }
          onSubmit={(values, actions) => {
            saveHandler(values, () => {
              actions.resetForm();
            });
          }}>
          {(formikprops) => (
            <ScrollView>
              <View style={{marginHorizontal: 10, marginTop: 20}}>
                <Row colGap={5}>
                  <Col width="50%">
                    <ICustomPicker
                      label="Market Name"
                      name="beat"
                      options={beatDDL}
                      onChange={(item) => {
                        formikprops.setFieldValue('beat', item);
                        getOutletNameDDL(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          formikprops?.values?.route?.value,
                          item?.value,
                          setOutletDDL,
                        );
                      }}
                      formikProps={formikprops}
                    />
                  </Col>
                  <Col width="50%">
                    <ICustomPicker
                      label="Outlet Name"
                      name="outlet"
                      options={outletDDL}
                      formikProps={formikprops}
                    />
                  </Col>
                  <Col width="50%">
                    <IDatePicker
                      label="Damage Entry Date"
                      name="dEntryDate"
                      onChange={(date) => {
                        formikprops.setFieldValue(
                          'dEntryDate',
                          _dateFormatter(date),
                        );
                        formikprops.setFieldValue(
                          'entryMonth',
                          getMonthName(_dateFormatter(date)),
                        );
                      }}
                      formikProps={formikprops}
                    />
                  </Col>
                  <Col width="50%">
                    <FormInput
                      name="entryMonth"
                      label="Damage Entry Month"
                      disabled={true}
                      formikProps={formikprops}
                    />
                  </Col>
                </Row>
                <CustomButton
                  onPress={() => viewHandler(formikprops?.values)}
                  btnTxt="Show"
                  isLoading={loading}
                />
                <View
                  style={{
                    marginVertical: 10,
                    padding: 10,
                    borderRadius: 5,
                    backgroundColor: '#ffffff',
                  }}>
                  <View
                    style={[
                      styles.cardStyle,
                      {justifyContent: 'space-between'},
                    ]}>
                    <Text style={[styles.customerAmount, {color: '#00B44A'}]}>
                      Damage Item Name
                    </Text>
                  </View>
                  <Row colGap={5}>
                    <Col width="50%">
                      <Text style={styles.customerAmount}>Damage Type</Text>
                    </Col>
                    <Col width="50%">
                      <Text
                        style={[
                          styles.teritoryText,
                          {fontWeight: 'bold', marginLeft: 20},
                        ]}>
                        Damage Quantity
                      </Text>
                    </Col>
                  </Row>
                </View>

                {landingData?.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      marginVertical: 10,
                      padding: 10,
                      borderRadius: 5,
                      backgroundColor: '#ffffff',
                    }}>
                    <View
                      style={[
                        styles.cardStyle,
                        {justifyContent: 'space-between'},
                      ]}>
                      <Text style={[styles.customerAmount, {color: '#00B44A'}]}>
                        {item?.damageItemCode}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.cardStyle,
                        {justifyContent: 'space-between'},
                      ]}>
                      <Row colGap={5}>
                        <Col width="50%">
                          <ICustomPicker
                            label="Damage type"
                            name="damageCategory"
                            value={item?.damageCategory || {}}
                            options={item?.objDamageTypeDDL}
                            disabled={item?.isApproved}
                            onChange={(slectedOption) => {
                              rowDtoHandler(
                                'damageCategory',
                                slectedOption,
                                index,
                              );
                            }}
                          />
                        </Col>
                        <Col width="50%">
                          <View style={{justifyContent: 'space-between'}}>
                            <Text
                              style={[
                                styles.teritoryText,
                                {fontWeight: 'bold', marginLeft: 20},
                              ]}>
                              Damage Quantity
                            </Text>
                            {item?.isApproved ? (
                              <Text
                                style={[
                                  styles.teritoryText,
                                  {textAlign: 'center'},
                                ]}>
                                {item?.damageItemQty}
                              </Text>
                            ) : (
                              <QuantityInputBox
                                style={{marginLeft: 17}}
                                value={item?.damageItemQty?.toString()}
                                onChange={(value) => {
                                  rowDtoHandler(
                                    'damageItemQty',
                                    Number(value),
                                    index,
                                    item,
                                    formikprops?.values,
                                  );
                                }}
                                onIncrement={(e) => {
                                  rowDtoHandler(
                                    'damageItemQty',
                                    Number(item?.damageItemQty) + 1,
                                    index,
                                    item,
                                    formikprops?.values,
                                  );
                                }}
                                onDecrement={(e) => {
                                  rowDtoHandler(
                                    'damageItemQty',
                                    Number(item?.damageItemQty) - 1,
                                    index,
                                    item,
                                    formikprops?.values,
                                  );
                                }}
                              />
                            )}
                          </View>
                        </Col>
                      </Row>
                    </View>
                  </View>
                ))}
                <CustomButton
                  onPress={formikprops.handleSubmit}
                  btnTxt="Save"
                  isLoading={loadingSave}
                />
              </View>
            </ScrollView>
          )}
        </Formik>
      </ScrollView>
    </>
  );
}

export default DamageCollectionForm;

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
  },
  label: {
    fontSize: 14,
    // fontFamily: 'Rubik-Regular',
    color: '#636363',
  },
  customerAmount: {
    fontWeight: 'bold',
  },

  cardStyle: {
    flexDirection: 'row',
  },
  teritoryText: {
    color: '#000000',
    paddingBottom: 10,
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
