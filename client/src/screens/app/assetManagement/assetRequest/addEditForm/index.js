import React, {useState, useEffect, useContext, useRef} from 'react';
import * as Yup from 'yup';
import {
  ScrollView,
  View,
  // Text,
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
import FabButton from '../../../../../common/components/FabButton';
import {_todayDate} from '../../../../../common/functions/_todayDate';
import {
  getOutletNameDDL,
  singleAttachmentAction,
} from '../../../../../common/actions/helper';
import {
  getOutletLicenceAndNid,
  getItemCategoryApiDDL,
  getMaximumSalesItemApiDDL,
  getItemApiDDL,
  getBrandingItemDDL,
  getItemSubCategoryApiDDL,
  editOutlateAssetRequest,
  createOutlateAssetREquest,
  getSingleDataById,
} from '../helper';
import FormInput from '../../../../../common/components/TextInput';
import {Toast} from 'native-base';
import FilePicker from '../../../../../common/components/FilePicker';
import ImageViewModal from '../../../../../common/components/ImageViewModal';
import ImageViewer from '../../../../../common/components/ImageViewer';
import Text from '../../../../../common/components/IText';

const validationSchema = Yup.object().shape({
  outlet: Yup.object().shape({
    label: Yup.string().required('Outlet Name is required'),
    value: Yup.string().required('Outlet Name is required'),
  }),
  salesItem: Yup.object().shape({
    label: Yup.string().required('Max Sales Item is required'),
    value: Yup.string().required('Max Sales Item is required'),
  }),
  salesAmount: Yup.number().required('Sales Amount is required'),
  brandingItem: Yup.object().shape({
    label: Yup.string().required('Branding Item is required'),
    value: Yup.string().required('Branding Item is required'),
  }),
});

const EditvalidationSchema = Yup.object().shape({
  outlet: Yup.object().shape({
    label: Yup.string().required('Outlet Name is required'),
    value: Yup.string().required('Outlet Name is required'),
  }),
  salesItem: Yup.object().shape({
    label: Yup.string().required('Max Sales Item is required'),
    value: Yup.string().required('Max Sales Item is required'),
  }),
  salesAmount: Yup.number().required('Sales Amount is required'),
});

const initValues = {
  outlet: '',
  outletAddress: '',
  outletLicense: '',
  outletOwnerId: '',
  requiredDate: _todayDate(),
  salesItem: '',
  salesAmount: '',
  brandingItem: '',
  comments: '',
  itemCategory: '',
  itemSubCategory: '',
  itemName: '',
  quantity: '',
  measurement: '',
  attachment: '',
  assetSizeType: '', // Last Added | Assing By HM Ikbal
};

function CreateAssetRequest({navigation, route: {params}}) {
  const {profileData, selectedBusinessUnit} = useContext(GlobalState);
  const [rowDto, setRowDto] = useState([]);
  const scrollViewRef = useRef();

  // Grid Data
  const [loading, setLoading] = useState(false);
  const [singleData, setSingleData] = useState('');

  // DDL State
  const [outletNameDDL, setOutletNameDDL] = useState([]);
  const [maximumSalesDDL, setMaximumSalesDDL] = useState([]);
  const [brandingItemDDL, setBrandingItemDDL] = useState([]);
  const [itemCategoryDDL, setitemCategoryDDL] = useState([]);
  const [itemSubCategoryDDL, setitemSubCategoryDDL] = useState([]);
  const [itemDDL, setItemDDL] = useState([]);
  const [assetSizeTypeDDL] = useState([
    {
      value: 'small',
      label: 'small',
    },
    {
      value: 'medium',
      label: 'medium',
    },
    {
      value: 'large',
      label: 'large',
    },
  ]);

  // Image View State
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState(false);

  // Formiks Setup
  const formikprops = useFormik({
    enableReinitialize: true,
    initialValues: params?.id
      ? {...singleData, market: params?.market, route: params?.route}
      : {
          ...initValues,
          market: params?.market,
          route: params?.route,
        },
    validationSchema: params?.id ? EditvalidationSchema : validationSchema,
    onSubmit: (values, actions) => {
      saveHandler(values, () => {
        actions.resetForm();
        setRowDto([]);
      });
    },
  });

  // DDL Call
  useEffect(() => {
    getOutletNameDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      params?.route?.value,
      params?.market?.value,
      setOutletNameDDL,
    );
    getItemCategoryApiDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setitemCategoryDDL,
    );
    getItemApiDDL(
      // formikprops?.values?.itemCategory?.value,
      // valueOption?.value,
      // profileData?.accountId,
      setItemDDL,
    );
    getMaximumSalesItemApiDDL(profileData?.accountId, setMaximumSalesDDL);
  }, [params?.route?.value, params?.market?.value]);

  // DLL Call For Branding Item | Here total 3 API calling behind the getCustomerDDL
  useEffect(() => {
    if (params?.territory?.value) {
      // Branding Item DDL Change
      getBrandingItemDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setBrandingItemDDL,
      );
    }
  }, [params?.territory?.value]);

  // Fetch Signle Data by Id
  useEffect(() => {
    if (params?.id) {
      getSingleDataById(params?.id, setSingleData, setRowDto);
    }
  }, [params?.id]);

  // Remove Row Data
  const remover = (ind) => {
    let filterData = rowDto?.filter((data, index) => index !== ind);
    setRowDto(filterData);
  };

  // Set Row Data
  const setter = () => {
    let itemInfo = rowDto?.find(
      (data) => data?.assetItemId === formikprops?.values.itemName.value,
    );
    if (itemInfo) {
      Toast.show({
        text: 'Item Already Exists',
        type: 'warning',
        duration: 3000,
      });
    } else {
      let obj = {
        assetItemId: formikprops?.values?.itemName?.value,
        requestQty: +formikprops?.values?.quantity,
        assetName: formikprops?.values?.itemName?.label,
        measurement: formikprops?.values?.measurement,
      };
      setRowDto([obj, ...rowDto]);
      setTimeout(() => {
        scrollViewRef?.current?.scrollToEnd({animating: true});
      }, 1000);
    }
  };

  // On Submit | Save handler
  const saveHandler = (values, cb) => {
    if (rowDto?.length > 0) {
      if (params?.id) {
        let formatRow = rowDto?.map((data) => {
          return {
            rowId: data?.rowId || 0,
            assetRequestId: +params?.id,
            assetItemId: data?.assetItemId,
            requestQty: data?.requestQty,
            measurement: data?.measurement,
          };
        });

        let payload = {
          objHeader: {
            assetRequestId: +params?.id,
            actionBy: profileData?.userId,
            isApproved: false,
          },
          objRow: formatRow,
        };
        editOutlateAssetRequest(payload, setLoading);
      } else {
        let formatRow = rowDto?.map((data) => {
          return {
            assetItemId: data?.assetItemId,
            requestQty: data?.requestQty,
            measurement: data?.measurement,
          };
        });
        let payload = {
          objHeader: {
            accountId: profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            territoryId: params?.territory.value,
            routeid: params?.route?.value,
            beatid: params?.market?.value,
            outletid: values?.outlet?.value,
            dteRequiredDate: _todayDate(),
            outletOwnerTradeLicenseNo: values?.outletLicense,
            outlerOwnerNid: values?.outletOwnerId,
            narration: values?.comments,
            maxSalesItemId: values?.salesItem?.value,
            numMonthlyAvgSalesAmount: +values?.salesAmount,
            brandingItemName: values?.brandingItem?.label,
            actionBy: profileData?.userId,

            assetSizeType: values?.assetSizeType?.value, // Last Added
          },
          objRow: formatRow,
        };
        try {
          if (values?.attachment?.uri) {
            // AttachmentLink Add | Single
            singleAttachmentAction(values?.attachment).then((data) => {
              // Upload Image Link
              const modifyPlyload = {
                ...payload,
                objHeader: {
                  ...payload?.objHeader,
                  attachFileInfo: data[0]?.id || '',
                },
              };
              createOutlateAssetREquest(modifyPlyload, setLoading, cb);
            });
          } else {
            // Payload Without Attachment
            createOutlateAssetREquest(payload, setLoading, cb);
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
    } else {
      Toast.show({
        text: 'Please add atleast one item',
        type: 'warning',
        duration: 3000,
      });
    }
  };

  return (
    <>
      <ScrollView>
        <CommonTopBar
          title={` ${
            params?.type.charAt(0).toUpperCase() + params?.type.slice(1)
          } Outlet Asset Request`}
        />

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
                options={outletNameDDL}
                formikProps={formikprops}
                disabled={params?.id ? true : false}
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
                label="Maximum Sales Item"
                name="salesItem"
                options={maximumSalesDDL}
                formikProps={formikprops}
                disabled={params?.id ? true : false}
              />
            </Col>

            <Col width="50%">
              <ICustomPicker
                label="Asset Size Type"
                name="assetSizeType"
                options={assetSizeTypeDDL}
                formikProps={formikprops}
                disabled={params?.id ? true : false}
              />
            </Col>

            <Col width="50%">
              <FormInput
                label="Monthly Avg Sales Amount"
                name="salesAmount"
                keyboardType="numeric"
                formikProps={formikprops}
                disabled={params?.id ? true : false}
              />
            </Col>

            {params?.type !== 'create' ? (
              <Col width="50%">
                <FormInput
                  label="Branding Item"
                  name="brandingItem"
                  formikProps={formikprops}
                  disabled
                />
              </Col>
            ) : (
              <Col width="50%">
                <ICustomPicker
                  label="Branding Item"
                  name="brandingItem"
                  options={brandingItemDDL}
                  formikProps={formikprops}
                />
              </Col>
            )}

            <Col width="50%">
              <FormInput
                label="Comments"
                name="comments"
                formikProps={formikprops}
                disabled={params?.id ? true : false}
              />
            </Col>

            {/* This Section Only for Edit And Create */}
            {params?.type !== 'view' ? (
              <>
                <Col width="50%" style={{justifyContent: 'center'}}>
                  <CustomButton
                    disabled={params?.type === 'view'}
                    onPress={formikprops.handleSubmit}
                    isLoading={loading}
                    btnTxt="Save"
                  />
                </Col>

                {/* Attatchment only for create | As like WEB */}
                {params?.type === 'create' ? (
                  <Col
                    width={formikprops?.values?.attachment?.uri ? '30%' : '50%'}
                    style={{justifyContent: 'center'}}>
                    <FilePicker
                      onSelect={(e) => {
                        formikprops?.setFieldValue('attachment', e);
                      }}
                      isIconBtn={true}
                    />
                  </Col>
                ) : null}

                {/* Create Attachment Preview */}
                {formikprops?.values?.attachment?.uri ? (
                  <Col width="20%" style={{justifyContent: 'center'}}>
                    <Image
                      style={{width: '100%', height: 50}}
                      source={{uri: formikprops?.values?.attachment?.uri}}
                    />
                  </Col>
                ) : null}
              </>
            ) : null}

            {/* View Page Attachment Preview */}
            {(params?.type === 'view' || params?.type === 'edit') &&
            formikprops?.values?.attachment?.uri ? (
              <Col width="20%" style={{justifyContent: 'center'}}>
                <TouchableOpacity
                  onPress={() => {
                    setShowModal(true);
                    setImage(formikprops?.values?.attachment?.uri);
                  }}>
                  <ImageViewer image={formikprops?.values?.attachment?.uri} />
                </TouchableOpacity>
              </Col>
            ) : null}
          </Row>

          {/* This Section Only for Edit And Create */}
          {params?.type !== 'view' ? (
            <>
              <Row style={{marginTop: 10}} colGap={5}>
                {/* <Col width="50%">
                  <ICustomPicker
                    label="Item Category"
                    name="itemCategory"
                    onChange={(valueOption) => {
                      formikprops?.setFieldValue('itemCategory', valueOption);
                      getItemSubCategoryApiDDL(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        valueOption?.value,
                        setitemSubCategoryDDL,
                      );
                    }}
                    options={itemCategoryDDL}
                    formikProps={formikprops}
                  />
                </Col>

                <Col width="50%">
                  <ICustomPicker
                    label="Item Sub-Category"
                    name="itemSubCategory"
                    onChange={(valueOption) => {
                      formikprops?.setFieldValue(
                        'itemSubCategory',
                        valueOption,
                      );
                      getItemApiDDL(
                        formikprops?.values?.itemCategory?.value,
                        valueOption?.value,
                        profileData?.accountId,
                        setItemDDL,
                      );
                    }}
                    options={itemSubCategoryDDL}
                    formikProps={formikprops}
                  />
                </Col> */}

                <Col width="50%">
                  <ICustomPicker
                    label="Asset Name"
                    name="itemName"
                    options={itemDDL}
                    formikProps={formikprops}
                  />
                </Col>

                <Col width="50%">
                  <FormInput
                    label="Quantity"
                    name="quantity"
                    keyboardType="numeric"
                    formikProps={formikprops}
                  />
                </Col>

                <Col width="50%">
                  <FormInput
                    label="Measurement"
                    name="measurement"
                    formikProps={formikprops}
                  />
                </Col>

                <Col width="30%" style={{justifyContent: 'center'}}>
                  <CustomButton
                    disabled={
                      !formikprops?.values?.quantity ||
                      !formikprops?.values?.itemName?.value ||
                      !formikprops?.values?.measurement
                    }
                    onPress={() => setter()}
                    btnTxt="Add"
                  />
                </Col>
              </Row>
            </>
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
              <Text style={styles.customerAmount}>Asset Name</Text>
              <Text style={[styles.address]}>Request Qty</Text>
            </Col>
            <Col width="50%">
              <Text style={styles.date}>Measurement</Text>

              {params?.type !== 'view' ? (
                <Text style={styles.date}>Action</Text>
              ) : null}
            </Col>
          </Row>

          <ScrollView ref={scrollViewRef}>
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
                  <Text style={styles.customerAmount}>{item?.assetName}</Text>
                  <Text style={[styles.address]}>{item?.requestQty}</Text>
                </Col>
                <Col width="50%">
                  <Text style={styles.date}>{item?.measurement}</Text>
                  {/* Hide for Delete */}
                  {params?.type !== 'view' ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        marginTop: 5,
                      }}>
                      <TouchableOpacity onPress={() => remover(index)}>
                        <Text
                          style={{
                            color: '#ffffff',
                            backgroundColor: 'red',
                            padding: 3,
                            borderRadius: 5,
                          }}>
                          Delete
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </Col>
              </Row>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Image View Modal */}
      <ImageViewModal
        showModal={showModal}
        setShowModal={setShowModal}
        image={image}
      />

      {formikprops?.values?.territory?.value &&
      formikprops?.values?.route?.value &&
      formikprops?.values?.market?.value ? (
        <FabButton
          onPress={() =>
            navigation.navigate('createAssetRequest', {
              ...formikprops?.values,
            })
          }
        />
      ) : null}
    </>
  );
}

export default CreateAssetRequest;

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
