import React, {useState, useContext, useEffect} from 'react';
import {ScrollView, StyleSheet, View, Text} from 'react-native';
import CommonTopBar from '../../../common/components/CommonTopBar';
import {Formik} from 'formik';
import {GlobalState} from '../../../GlobalStateProvider';

import {_todayDate} from '../../../common/functions/_todayDate';
import Row from '../../../common/components/Row';
import Col from '../../../common/components/Col';
import {getMrpPrice} from './helper';
import NoDataFoundGrid from '../../../common/components/NoDataFoundGrid';

const MrpPrice = ({navigation, route: {params}}) => {
  const {profileData, selectedBusinessUnit} = useContext(GlobalState);

  const [rowData, setRowData] = useState({});

  useEffect(() => {
    if (params?.itemRowData?.length > 0) {
      getMrpPrice(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        params?.itemRowData,
        setRowData,
      );
    }
  }, [params?.itemRowData]);

  return (
    <>
      <CommonTopBar />
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
              <View style={{paddingHorizontal: 10, alignItems: 'center'}}>
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
                        <Col width="50%">
                          <Text
                            style={[styles.singleHeader, {textAlign: 'left'}]}>
                           TP Rate : {rowData?.totalTpRate}
                          </Text>
                        </Col>
                        <Col width="50%">
                          <Text
                            style={[styles.singleHeader, {textAlign: 'left'}]}>
                            MRP Rate : {rowData?.totalMrpRate}
                          </Text>
                        </Col>
                      </Row>
                    </View>
                  </View>
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

export default MrpPrice;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  selectItemStyle: {
    padding: 5,
  },
  singleHeader: {fontWeight: 'bold', textAlign: 'center'},
});
