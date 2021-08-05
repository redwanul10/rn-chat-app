import React, {useState, useEffect, useContext, useRef} from 'react';
import * as Yup from 'yup';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {useFormik} from 'formik';
import Row from '../../../../../common/components/Row';
import Col from '../../../../../common/components/Col';
import CommonTopBar from '../../../../../common/components/CommonTopBar';
import ICustomPicker from '../../../../../common/components/ICustomPicker';
import CustomButton from '../../../../../common/components/CustomButton';
import {GlobalState} from '../../../../../GlobalStateProvider';
import {_dateFormatter} from '../../../../../common/functions/_dateFormatter';
import {_todayDate} from '../../../../../common/functions/_todayDate';
import {singleAttachmentAction} from '../../../../../common/actions/helper';
import {
  getItemDDL,
  getMaintainanceTypeDDL,
  getMaintenanceItemAssetCodeDDL,
  getMaintainanceItemDDL,
  createOutlateAssetMaintenance,
  getReceiveDetails,
} from '../helper';
import FormInput from '../../../../../common/components/TextInput';
import FilePicker from '../../../../../common/components/FilePicker';
import IDatePicker from '../../../../../common/components/IDatePicker';

const validationSchema = Yup.object().shape({
  assetName: Yup.object().shape({
    label: Yup.string().required('Asset Name is required'),
    value: Yup.string().required('Asset Name is required'),
  }),
  assetCode: Yup.object().shape({
    label: Yup.string().required('Asset Code is required'),
    value: Yup.string().required('Asset Code is required'),
  }),
  maintenanceType: Yup.object().shape({
    label: Yup.string().required('Maintenance Type is required'),
    value: Yup.string().required('Maintenance Type is required'),
  }),
  qtyOrAmount: Yup.string().required('Quantity/Amount is required'),
});

const initValues = {
  // Header Form
  route: '',
  market: '',
  outlet: '',
  itemIssueDate: '',
  commentsHeader: '',

  assetName: '',
  assetCode: '',
  maintenanceCostType: {label: 'Amount', value: 1},
  maintenanceType: '',
  dueDate: _todayDate(),
  maintenanceDate: _todayDate(),
  maintenanceProduct: '',
  qtyOrAmount: '',
  productQty: '',
  item: '',

  partyName: '',
  partyContactNo: '',

  commentsRow: '',
  attachment: '',
};

function CreateAssetMaintenance({navigation, route: {params}}) {
  const {profileData, selectedBusinessUnit} = useContext(GlobalState);
  const [rowDto, setRowDto] = useState([]);
  const scrollViewRef = useRef();

  // Grid Data
  const [loading, setLoading] = useState(false);
  // const [singleData, setSingleData] = useState('');

  // DDL State
  const [itemNameDDL, setItemNameDDL] = useState([]);
  const [maintenanceTypeDDL, setMaintenanceTypeDDL] = useState([]);
  const [
    maintenanceItemAssetCodeDDL,
    setMaintenanceItemAssetCodeDDL,
  ] = useState([]);
  const [maintenanceProductDDL, setMaintenanceProductDDL] = useState([]);

  // Formiks Setup
  const formikprops = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...initValues,
      outlet: params?.outlet,
      market: params?.market,
      route: params?.route,
    },
    validationSchema: validationSchema,
    onSubmit: (values, actions) => {
      saveHandler(values, () => {
        actions.resetForm();
      });
    },
  });


  const saveHandler = (values, cb) => {
    if (values) {
      const payload = {
        objHeader: {
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          territoryId: params?.territory?.value,
          routeId: params?.route?.value,
          beatId: params?.market?.value,
          outletid: params?.outlet?.value,
          outletName: params?.outlet?.label,
          outletAddress: params?.outlet?.address,
          actionBy: profileData?.userId,
          partyName: values?.partyName || '',
          partyContactNo: values?.partyContactNo || '',
          maintenancetypeId: values?.maintenanceType?.value,
        },
        objRow: [
          {
            assetReceivedRowId: values?.item?.rowId,
            assetMaintenanceId: 0,
            assetItemId: values?.item?.assetItemId,
            receiveQuantity: 1, // Hardcode 1 assign by iftakhar bhai

            dteItemIssueDate: values?.itemIssueDate,
            narration: values?.item?.narration,

            dteDueDate: values?.dueDate,
            dteMaintenanceDate: values?.maintenanceDate,
            maintainceCostType: values?.maintenanceCostType?.label,
            assetItemCode: values?.assetCode?.label,

            monthlyMaintenanceProductId: values?.maintenanceProduct?.value || 0,
            monthlyMaintenanceProduct: values?.maintenanceProduct?.label || '',

            numServiceAmount: values?.qtyOrAmount,
            numServiceQuantity: values?.productQty || 0,
            maintenanceNarration: values?.commentsRow || '',

            dteRequestDate: _todayDate(),
            actionBy: profileData?.userId,
            attachmentFile: values?.attachment,
          },
        ],
      };
      try {
        if (values?.attachment?.uri) {
          // AttachmentLink Add | Single
          singleAttachmentAction(values?.attachment).then((data) => {
            // Upload Image Link
            const modifyPlyload = {
              ...payload,
              objRow: [
                {...payload?.objRow[0], attachmentFile: data[0]?.id || ''},
              ],
            };
            // console.log('Payload ', modifyPlyload);
            createOutlateAssetMaintenance(modifyPlyload, setLoading, cb);
          });
        } else {
          // Payload Without Attachment
          createOutlateAssetMaintenance(payload, setLoading, cb);
        }
      } catch (error) {
        Toast.show({
          text: error?.response?.data?.message || 'Image Upload Failed',
          type: 'warning',
          duration: 3000,
        });
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getItemDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        params?.outlet?.value,
        setItemNameDDL,
      );
      getMaintainanceTypeDDL(setMaintenanceTypeDDL);
    }
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  return (
    <>
      <ScrollView>
        <CommonTopBar title={`Create Outlet Asset Maintenance`} />

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
                      id: formikprops?.values?.outlet?.value,
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
                options={itemNameDDL}
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
              <ICustomPicker
                label="Asset Code"
                name="assetCode"
                onChange={(valueOption) => {
                  formikprops?.setFieldValue('assetCode', valueOption);
                  formikprops?.setFieldValue(
                    'itemIssueDate',
                    valueOption?.name,
                  );
                }}
                options={maintenanceItemAssetCodeDDL}
                formikProps={formikprops}
              />
            </Col>

            <Col width="50%">
              <ICustomPicker
                label="Maintenance Type"
                name="maintenanceType"
                options={maintenanceTypeDDL}
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
                label="Due Date"
                name="dueDate"
                formikProps={formikprops}
              />
            </Col>

            <Col width="50%">
              <IDatePicker
                label="Maintenance Date"
                name="maintenanceDate"
                formikProps={formikprops}
              />
            </Col>

            <Col width="50%">
              <ICustomPicker
                label="Maintenance Cost Type"
                name="maintenanceCostType"
                options={[
                  {label: 'Amount', value: 1},
                  {label: 'Product', value: 2},
                ]}
                onChange={(valueOption) => {
                  formikprops?.setFieldValue(
                    'maintenanceCostType',
                    valueOption,
                  );
                  getMaintainanceItemDDL(
                    profileData?.accountId,
                    setMaintenanceProductDDL,
                  );
                }}
                formikProps={formikprops}
              />
            </Col>

            {formikprops.values?.maintenanceCostType?.value === 2 ? (
              <>
                <Col width="50%">
                  <ICustomPicker
                    label="Maintenance Product"
                    name="maintenanceProduct"
                    options={maintenanceProductDDL}
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

            <Col width="50%">
              <FormInput
                label="Quantity/Amount (Monthly)"
                name="qtyOrAmount"
                keyboardType="numeric"
                formikProps={formikprops}
              />
            </Col>

            <Col width="50%">
              <FormInput
                label="Comments"
                name="commentsRow"
                formikProps={formikprops}
                disabled={params?.id ? true : false}
              />
            </Col>

            <Col width="20%" style={{justifyContent: 'center'}}>
              <FilePicker
                onSelect={(e) => {
                  formikprops?.setFieldValue('attachment', e);
                }}
                isIconBtn={true}
              />
            </Col>

            <Col width="80%" style={{justifyContent: 'center'}}>
              <CustomButton
                onPress={formikprops.handleSubmit}
                isLoading={loading}
                btnTxt="Save"
              />
            </Col>

            {formikprops?.values?.attachment?.uri ? (
              <Col width="20%" style={{justifyContent: 'center', marginTop: 5}}>
                <Image
                  style={{width: 80, height: 80}}
                  source={{uri: formikprops?.values?.attachment?.uri}}
                />
              </Col>
            ) : null}
          </Row>
        </View>
      </ScrollView>
    </>
  );
}

export default CreateAssetMaintenance;

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
