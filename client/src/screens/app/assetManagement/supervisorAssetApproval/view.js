/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState, useEffect} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';

import CommonTopBar from '../../../../common/components/CommonTopBar';
import {Formik} from 'formik';
import {GlobalState} from '../../../../GlobalStateProvider';
import CustomButton from '../../../../common/components/CustomButton';
import Row from '../../../../common/components/Row';
import Col from '../../../../common/components/Col';
import {_todayDate} from '../../../../common/functions/_todayDate';
import {_dateFormatter} from '../../../../common/functions/_dateFormatter';
import {
  GetOutletAssetRequestItemDetails_api,
  outletAssetRequestApproval,
} from './helper';
import QuantityInputBox from '../../../../common/components/QuantityInputBox';
import {Toast} from 'native-base';
import Text from '../../../../common/components/IText';

const initValues = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  status: {value: 1, label: 'Approved'},
};

function AssetRequestApprovalView({navigation, route: {params}}) {
  const {profileData} = useContext(GlobalState);
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    GetOutletAssetRequestItemDetails_api(params?.id, setLoading, setRowDto);
  }, [params?.id]);

  const outletRequestApproveAmount = (value, index) => {
    let newRowdata = [...rowDto];
    if (value <= newRowdata[index].requestQty) {
      newRowdata[index].requestQtyApproved = +value >= 0 ? value : '';
      setRowDto(newRowdata);
    }
  };

  const saveHandler = (values) => {
    const filterQtyRowData = rowDto?.filter(
      (item) => item?.requestQtyApproved >= 0,
    );
    if (filterQtyRowData?.length > 0) {
      const objRowData = filterQtyRowData?.map((itm) => {
        return {
          rowId: itm?.rowId,
          assetRequestId: itm?.assetRequestId,
          assetItemId: itm?.assetItemId,
          requestQty: +itm?.requestQtyApproved,
          measurement: itm?.measurement,
        };
      });
      const payload = {
        objHeader: {
          assetRequestId: +params?.id,
          actionBy: profileData?.userId,
          isApproved: true,
        },
        objRow: objRowData,
      };
      outletAssetRequestApproval(
        payload,
        setLoading,
        () => {
          GetOutletAssetRequestItemDetails_api(
            params?.id,
            setLoading,
            setRowDto,
          );
        },
        setApproved,
      );
    } else {
      Toast.show({
        text: 'Please add atleast one asset with quantity',
        type: 'warning',
        duration: 3000,
      });
    }
  };

  return (
    <>
      <ScrollView>
        <CommonTopBar title={'Outlet Asset Request Approval'} />
        <Formik
          enableReinitialize={true}
          initialValues={{...initValues}}
          onSubmit={(values, actions) => {
            saveHandler();
          }}>
          {(formikprops) => (
            <>
              <View style={{paddingHorizontal: 10, marginTop: 10}}>
                <ScrollView>
                  {params?.status?.value === 2 && approved === false ? (
                    <CustomButton
                      onPress={formikprops.handleSubmit}
                      isLoading={loading}
                      btnTxt="Approve"
                    />
                  ) : null}

                  {/* Header Part */}
                  <Row
                    style={{
                      marginVertical: 10,
                      padding: 10,
                      borderRadius: 5,
                      backgroundColor: '#ffffff',
                    }}>
                    <Col width="50%">
                      <Text style={styles.customerAmount}>Asset Item Name</Text>
                      <Text style={[styles.customerAmount, styles.fontSize]}>
                        Measurement
                      </Text>
                    </Col>
                    <Col width="50%">
                      <Text
                        style={[styles.date, {fontSize: 15, color: 'green'}]}>
                        Request Qty
                      </Text>
                      <Text style={styles.date}>Approved Qty</Text>
                    </Col>
                  </Row>

                  {rowDto?.map((item, index) => (
                    <Row
                      key={index}
                      style={{
                        marginVertical: 10,
                        padding: 10,
                        borderRadius: 5,
                        backgroundColor: '#ffffff',
                      }}>
                      <Col width="50%">
                        <Text style={styles.customerAmount}>
                          {item?.assetItemName}
                        </Text>
                        <Text style={[styles.customerAmount, styles.fontSize]}>
                          {item?.measurement}
                        </Text>
                      </Col>
                      <Col width="50%">
                        <Text
                          style={[styles.date, {fontSize: 15, color: 'green'}]}>
                          {item?.requestQty}
                        </Text>
                        <View style={[styles.date, {alignItems: 'flex-end'}]}>
                          {params?.status?.value === 2 ? (
                            <QuantityInputBox
                              value={item?.requestQtyApproved?.toString()}
                              onChange={(value) => {
                                if (value <= item?.requestQty) {
                                  outletRequestApproveAmount(
                                    Number(value),
                                    index,
                                  );
                                }
                              }}
                              onIncrement={(e) => {
                                if (
                                  item?.requestQtyApproved <= item?.requestQty
                                ) {
                                  outletRequestApproveAmount(
                                    Number(item?.requestQtyApproved) + 1,
                                    index,
                                  );
                                }
                              }}
                              onDecrement={(e) => {
                                if (
                                  item?.requestQtyApproved <= item?.requestQty
                                ) {
                                  outletRequestApproveAmount(
                                    Number(item?.requestQtyApproved) - 1,
                                    index,
                                  );
                                }
                              }}
                            />
                          ) : (
                            <>
                              <Text>{item?.requestQtyApproved}</Text>
                            </>
                          )}
                        </View>
                      </Col>
                    </Row>
                  ))}
                </ScrollView>
              </View>
            </>
          )}
        </Formik>
      </ScrollView>
    </>
  );
}

export default AssetRequestApprovalView;

const styles = StyleSheet.create({
  customerAmount: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#000000',
  },
  date: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'right',
  },
  editButton: {
    marginTop: 5,
    backgroundColor: '#00cdac',
    paddingHorizontal: 10,
    paddingVertical: 3,
    color: 'white',
    borderRadius: 5,
  },
  fontSize: {
    fontSize: 13,
  },
  address: {color: '#00B44A', fontWeight: 'bold', fontSize: 14},
});
