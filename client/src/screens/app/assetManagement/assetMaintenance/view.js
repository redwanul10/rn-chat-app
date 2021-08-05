import React, {useState, useEffect, useContext, useRef} from 'react';
import * as Yup from 'yup';
import {
  ScrollView,
  View,
  // Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import {useFormik} from 'formik';
import Row from '../../../../common/components/Row';
import Col from '../../../../common/components/Col';
import CommonTopBar from '../../../../common/components/CommonTopBar';
import ICustomPicker from '../../../../common/components/ICustomPicker';
import {GlobalState} from '../../../../GlobalStateProvider';
import {_dateFormatter} from '../../../../common/functions/_dateFormatter';
import {_todayDate} from '../../../../common/functions/_todayDate';
import {getSingleDataById} from './helper';
import FormInput from '../../../../common/components/TextInput';
import IDatePicker from '../../../../common/components/IDatePicker';
import ImageViewModal from '../../../../common/components/ImageViewModal';
import Icon from 'react-native-vector-icons/Entypo';
import Text from '../../../../common/components/IText';

function AssetMaintenanceView({navigation, route: {params}}) {
  const {profileData, selectedBusinessUnit} = useContext(GlobalState);

  const [singleData, setSingleData] = useState('');
  const [rowDto, setRowDto] = useState([]);

  // Image View State
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState(false);

  // Formiks Setup
  const formikprops = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...singleData,
      outlet: params?.outlet,
      market: params?.market,
      route: params?.route,
    },
    onSubmit: (values, actions) => {
      saveHandler(values, () => {
        actions.resetForm();
      });
    },
  });

  // Fetch Signle Data by Id
  useEffect(() => {
    getSingleDataById(
      params?.id,
      params?.outlet?.value,
      params?.item?.value,
      setSingleData,
      setRowDto,
      params?.assetItemCode,
    );
  }, [params?.id]);

  return (
    <>
      <ScrollView>
        <CommonTopBar title={`View Outlet Asset Maintenance`} />

        <View style={{marginHorizontal: 10, marginTop: 20}}>
          <Row colGap={5}>
            <Col width="70%">
              <ICustomPicker
                label="Outlet Name"
                name="outlet"
                onChange={(item) => {
                  formikprops?.setFieldValue('outlet', item);
                  getOutletLicenceAndNid(
                    item?.value,
                    formikprops?.setFieldValue,
                  );
                  formikprops?.setFieldValue('outletAddress', item?.address);
                }}
                disabled={true}
                options={[]}
                formikProps={formikprops}
              />
            </Col>

            {formikprops?.values?.outlet?.value && (
              <Col width="30%" style={{justifyContent: 'center'}}>
                <TouchableOpacity
                  style={styles.btnStyle}
                  onPress={() => {
                    navigation.navigate('View Outlet Profile', {
                      id: params?.outlet?.value,
                    });
                  }}>
                  <Text style={{color: '#ffffff'}}>Details</Text>
                </TouchableOpacity>
              </Col>
            )}

            <Col width="50%">
              <ICustomPicker
                label="Asset Name"
                name="assetName"
                options={[]}
                onChange={(valueOption) => {
                  formikprops?.setFieldValue('assetName', valueOption);
                  getMaintenanceItemAssetCodeDDL(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    formikprops?.values?.outlet?.value,
                    valueOption?.value,
                    setMaintenanceItemAssetCodeDDL,
                  );
                  getReceiveDetails(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    formikprops?.values?.outlet?.value,
                    valueOption?.value,
                    formikprops.setFieldValue,
                  );
                }}
                formikProps={formikprops}
                disabled={params?.id ? true : false}
              />
            </Col>

            <Col width="50%">
              <FormInput
                label="Asset Code"
                name="assetCode"
                formikProps={formikprops}
                disabled={true}
              />
            </Col>

            <Col width="50%">
              <ICustomPicker
                label="Maintenance Type"
                name="maintenanceType"
                options={[]}
                formikProps={formikprops}
                disabled={params?.id ? true : false}
              />
            </Col>

            {formikprops?.values?.maintenanceType?.value === 3 ? (
              <>
                <Col width="50%">
                  <FormInput
                    label="Party Name"
                    name="partyName"
                    formikProps={formikprops}
                  />
                </Col>

                <Col width="50%">
                  <FormInput
                    label="Contact No"
                    name="partyContactNo"
                    keyboardType="numeric"
                    formikProps={formikprops}
                  />
                </Col>
              </>
            ) : null}

            <Col width="50%">
              <IDatePicker
                label="Item Issue Date"
                name="itemIssueDate"
                formikProps={formikprops}
              />
            </Col>

            <Col width="50%">
              <FormInput
                label="Comments"
                name="commentsHeader"
                formikProps={formikprops}
                disabled={true}
              />
            </Col>

            {formikprops.values?.maintenanceCostType?.value === 2 ? (
              <>
                <Col width="50%">
                  <ICustomPicker
                    label="Maintenance Product"
                    name="maintenanceProduct"
                    options={[]}
                    formikProps={formikprops}
                  />
                </Col>

                <Col width="50%">
                  <FormInput
                    label="Product Quantity"
                    name="productQty"
                    keyboardType="numeric"
                    formikProps={formikprops}
                  />
                </Col>
              </>
            ) : null}

            {/* {formikprops?.values?.attachment?.uri ? (
              <Col width="20%" style={{justifyContent: 'center', marginTop: 5}}>
                <Image
                  style={{width: 80, height: 80}}
                  source={{uri: formikprops?.values?.attachment?.uri}}
                />
              </Col>
            ) : null} */}
          </Row>

          <Row
            style={{
              marginVertical: 10,
              padding: 10,
              borderRadius: 5,
              backgroundColor: '#ffffff',
            }}>
            <Col width="50%">
              <Text style={[styles.customerAmount, {color: 'green'}]}>
                Request Date
              </Text>
              <Text style={[styles.date, {textAlign: 'left'}]}>
                Maintenance Date
              </Text>
              <Text style={[styles.date, {textAlign: 'left'}]}>
                Maintaince Cost Type
              </Text>
            </Col>
            <Col width="50%">
              <Text style={styles.date}>Maintenance Product (Monthly)</Text>
              <Text style={[styles.date, {color: 'green'}]}>Amount/Qty</Text>
              <Text style={[styles.date]}>Comments</Text>
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
                <Text style={[styles.customerAmount, {color: 'green'}]}>
                  {_dateFormatter(item?.requestDate)}
                </Text>
                <Text style={[styles.date, {textAlign: 'left'}]}>
                  {_dateFormatter(item?.maintenanceDate)}
                </Text>
                <Text style={[styles.date, {textAlign: 'left'}]}>
                  {item?.maintainceCostType}
                </Text>
              </Col>
              <Col width="50%">
                <Text style={styles.date}>
                  {item?.monthlyMaintenanceProduct || '-'}
                </Text>
                <Text style={[styles.date, {color: 'green'}]}>
                  {item?.serviceQuantity || item?.serviceAmount}
                </Text>
                <Text style={[styles.date]}>{item?.maintenanceNarration}</Text>

                {item?.attachmentFile ? (
                  <>
                    <TouchableOpacity
                      onPress={() => {
                        setShowModal(true);
                        setImage(item?.attachmentFile);
                      }}>
                      <Text
                        style={{
                          color: 'green',
                          fontWeight: 'bold',
                          textAlign: 'right',
                        }}>
                        <Icon style={{color: 'black'}} name="eye" size={20} />
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : null}
              </Col>
            </Row>
          ))}
        </View>
        {/* Image View Modal */}
        <ImageViewModal
          showModal={showModal}
          setShowModal={setShowModal}
          image={image}
        />
      </ScrollView>
    </>
  );
}

export default AssetMaintenanceView;

const styles = StyleSheet.create({
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
  date: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'right',
  },
  address: {color: '#00B44A', fontWeight: 'bold', fontSize: 14},
  btnStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    marginVertical: 5,
    color: 'white',
    borderRadius: 5,
    backgroundColor: '#063197',
  },
});
