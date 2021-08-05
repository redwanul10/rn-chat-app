import React, {useState, useContext, useEffect} from 'react';
import {ScrollView, StyleSheet, View, Text} from 'react-native';
import CommonTopBar from '../../../common/components/CommonTopBar';
import {Formik} from 'formik';
import {GlobalState} from '../../../GlobalStateProvider';

import {_todayDate} from '../../../common/functions/_todayDate';
import Row from '../../../common/components/Row';
import Col from '../../../common/components/Col';
import {getSlubOffer} from './helper';
import NoDataFoundGrid from '../../../common/components/NoDataFoundGrid';

const SlubOffer = ({navigation, route: {params}}) => {
  const {profileData, selectedBusinessUnit} = useContext(GlobalState);

  const [rowData, setRowData] = useState();

  useEffect(() => {
    if (params?.itemRowData?.length > 0) {
      getSlubOffer(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        params?.itemRowData,
        setRowData,
      );
    }
  }, [params?.itemRowData]);

  return (
    <>
      <CommonTopBar title={'Slub Offer'} />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <Formik
          enableReinitialize={true}
          initialValues={{...params}}
          onSubmit={(values, actions) => {
            saveHandler(values, () => {
              actions.resetForm();
            });
          }}>
          {(formikprops) => (
            <>
              <View style={{paddingHorizontal: 10}}>
                <Row colGap={2}>
                  <View
                    style={[
                      {
                        marginBottom: 5,
                        backgroundColor: '#ffffff',
                        borderRadius: 7,
                        paddingHorizontal: 5,
                        paddingVertical: 10,
                        marginTop: 5,
                      },
                    ]}>
                    <View style={styles.selectItemStyle}>
                      <Row>
                        <Col
                          width="100%"
                          style={{
                            flexDirection: 'row',
                          }}>
                          <Text
                            style={[styles.singleHeader, {textAlign: 'left'}]}>
                            Item Name
                          </Text>
                          <Text style={styles.singleHeader}>Code</Text>
                          <Text style={styles.singleHeader}>UoM Name</Text>
                          <Text
                            style={[styles.singleHeader, {textAlign: 'right'}]}>
                            Qty
                          </Text>
                        </Col>
                      </Row>
                    </View>
                  </View>
                </Row>

                <Row>
                  {rowData?.map((item, index) => {
                    return (
                      <View
                        key={index}
                        style={[
                          {
                            marginBottom: 5,
                            backgroundColor: '#ffffff',
                            borderRadius: 7,
                            paddingHorizontal: 5,
                            paddingVertical: 10,
                            marginTop: 5,
                          },
                        ]}>
                        <View style={styles.selectItemStyle}>
                          <Row>
                            {/* productImage */}
                            <Col
                              width="100%"
                              style={{
                                flexDirection: 'row',
                                // justifyContent: 'space-between',
                              }}>
                              <Text
                                width="25%"
                                style={[
                                  styles.singleHeader,
                                  {textAlign: 'left'},
                                ]}>
                                {item?.offerItemName}
                              </Text>
                              <Text
                                width="25%"
                                style={[
                                  styles.singleHeader,
                                  {textAlign: 'center'},
                                ]}>
                                {item?.offerItemCode || '-'}
                              </Text>
                              <Text
                                width="25%"
                                style={[
                                  styles.singleHeader,
                                  {textAlign: 'center'},
                                ]}>
                                {item?.offerItemUomName}
                              </Text>
                              <Text
                                width="25%"
                                style={[
                                  styles.singleHeader,
                                  {textAlign: 'right'},
                                ]}>
                                {item?.offerQuantity}
                              </Text>
                            </Col>
                          </Row>
                        </View>
                      </View>
                    );
                  })}
                </Row>
              </View>
              {rowData?.length === 0 ? (
                <NoDataFoundGrid message={'No Offer'} />
              ) : null}
            </>
          )}
        </Formik>
      </ScrollView>
    </>
  );
};

export default SlubOffer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  selectItemStyle: {
    padding: 5,
  },
  singleHeader: {fontWeight: 'bold', width: '25%', textAlign: 'center'},
});
