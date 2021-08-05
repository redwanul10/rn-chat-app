import React, {useState, useEffect, useContext} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import CommonTopBar from '../../../../../../common/components/CommonTopBar';
import {GlobalState} from '../../../../../../GlobalStateProvider';
import {
  editOutletProfile,
  getOutletProfileById,
  getOutletProfileTypeInfo,
} from '../helper';
import Icon from 'react-native-vector-icons/AntDesign';
import CustomButton from '../../../../../../common/components/CustomButton';
import {uploadBaseSixtyFourImage} from '../../../../../../common/actions/helper';

function EditLanding({route: {params}, navigation}) {
  const {profileData, selectedBusinessUnit} = useContext(GlobalState);
  const [outletProfile, setOutletProfile] = useState({});
  const [outletProfileType, setOutletProfileType] = useState([]);
  const [loading, setLoading] = useState(false);

  // validations state
  const [isOutletInfoDone, setIsOutletInfoDone] = useState(false);
  const [isOwnerInfoDone, setIsOwnerInfoDone] = useState(false);
  const [isBusinessInfoDone, setIsBusinessInfoDone] = useState(false);

  useEffect(() => {
    getOutletProfileById(params?.id, setOutletProfile);
    getOutletProfileTypeInfo(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setOutletProfileType,
    );
  }, []);

  const onUpdateHandler = (updatedData) => {
    setOutletProfile({
      ...outletProfile,
      ...updatedData,
    });

    if (updatedData?.outletInfo) setIsOutletInfoDone(true);
    if (updatedData?.ownerInfo) setIsOwnerInfoDone(true);
    if (updatedData?.businessInfo) setIsBusinessInfoDone(true);
  };

  const saveHandler = () => {
    const {
      outletInfo,
      ownerInfo,
      businessInfo,
      attibuteDeatils,
    } = outletProfile;

    // if (!isBusinessInfoDone) return alert('fill');

    const objAttr = outletProfileType?.map((item) => {
      const {objAttribute, objAttributeValue} = item;

      const isDDL = objAttribute?.uicontrolType === 'DDL';
      const isDate = objAttribute?.uicontrolType === 'Date';
      const isNumber = objAttribute?.uicontrolType === 'Number';
      const fieldValue = businessInfo
        ? businessInfo[objAttribute?.outletAttributeName]
        : '';

      // find same field to get row id
      const find = attibuteDeatils?.find(
        (attr) =>
          attr?.outletAttributeName === objAttribute?.outletAttributeName,
      );
      return {
        rowId: +find?.rowId || 0,
        outletId: +params?.id,
        outletName: outletInfo?.outletName,
        outletAttributeId: objAttribute?.outletAttributeId,
        attributeValueId: fieldValue?.value || 0,
        outletAttributeValueName: isDDL
          ? fieldValue?.label || ''
          : isNumber
          ? +fieldValue || 0
          : fieldValue || '',
        attributeValueDate: isDate ? fieldValue : '',
        // actionBy: profileData?.userId,
      };
    });

    let payload = {
      objProfile: {
        outletID: +params?.id,
        beatId: outletInfo?.marketName?.value || 0,
        beatName: outletInfo?.marketName?.label || '',
        outletBanglaName: outletInfo?.outletBanglaName || '',
        isHvo: outletInfo?.isHvo,
        strOwnerName: outletInfo?.ownerName || '',
        strOutletAddress: outletInfo?.outletAddress || '',
        maritatualStatusId: ownerInfo?.marriageStatus?.value || 0,
        maritatualStatus: ownerInfo?.marriageStatus?.label || '',
        outletName: outletInfo?.outletName || '',
        actionBy: profileData?.userId,
        dateOfBirth: ownerInfo?.dateOfBirth || '',
        marriageDate: ownerInfo?.marriageDate || '',
        emailAddress: ownerInfo?.email || '',
        latitude: outletInfo?.lattitude,
        longitude: outletInfo?.longitude,
        outletImagePath: outletInfo?.outletImagePath,
        contactType: ownerInfo?.contactType || '',
        // outletImagePathNew: 'string',
        isProfileComplete: false,
        maxSalesItem: outletInfo?.maxSalesItem?.value || 0,
        maxSalesItemName: outletInfo?.maxSalesItem?.label || '',
        tradeLicenseNo: outletInfo?.tradeLicenseNo || '',
        ownerNIDNo: ownerInfo?.ownerNid || '',
        monMonthlyAvgSales: +outletInfo?.avarageAmount || 0,
        cooler: outletInfo?.isColler ? outletInfo?.isColler : false,
        mobileNumber: outletInfo?.ownerNumber || '', // Last Change Assign By HM Ikbal
        coolerCompanyId: outletInfo?.collerCompany?.value || 0,
        coolerCompanyName: outletInfo?.collerCompany?.label || '',
      },
      objAttr,
    };

    if (outletInfo?.selectedFile) {
      uploadBaseSixtyFourImage(outletInfo?.selectedFile, (imgId) => {
        payload = {
          ...payload,
          objProfile: {
            ...payload?.objProfile,
            outletImagePath: imgId || outletInfo?.outletImagePath,
          },
        };

        // console.log('pa', JSON.stringify(payload, null, 2));
        editOutletProfile(payload, setLoading);
      });
    } else {
      editOutletProfile(payload, setLoading);
    }
    // editOutletProfile(payload, setLoading);
  };

  return (
    <>
      <CommonTopBar />
      {/* <Text>{JSON.stringify(outletInfo, null, 2)}</Text> */}

      <View style={{padding: 20}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          {/* Outlet Info */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Edit Outlet Info', {
                outletInfo: outletProfile?.outletInfo,
                // setIsOutletInfoDone,
                onUpdateHandler,
              });
            }}>
            <Image source={require('../../../../../../assets/edit_one.png')} />
            <Text style={styles.textColor}>Outlet Information</Text>
            {isOutletInfoDone && (
              <Icon style={styles.icon} name="checkcircleo" size={17} />
            )}
          </TouchableOpacity>

          {/* Owner Info */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Edit Owner Info', {
                ownerInfo: outletProfile?.ownerInfo,
                // setIsOwnerInfoDone,
                onUpdateHandler,
              });
            }}>
            <Image source={require('../../../../../../assets/edit_two.png')} />
            <Text style={styles.textColor}>Owner Information</Text>
            {isOwnerInfoDone && (
              <Icon style={styles.icon} name="checkcircleo" size={17} />
            )}
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row', marginTop: 20}}>
          {/* Business Info */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Edit Business Info', {
                businessInfo: outletProfile?.businessInfo,
                onUpdateHandler,
              });
            }}>
            <Image
              source={require('../../../../../../assets/edit_three.png')}
            />
            <Text style={styles.textColor}>Business Information</Text>
            {isBusinessInfoDone && (
              <Icon style={styles.icon} name="checkcircleo" size={17} />
            )}
          </TouchableOpacity>
          <Text></Text>
        </View>

        <CustomButton onPress={saveHandler} isLoading={loading} btnTxt="Save" />
      </View>
    </>
  );
}

export default EditLanding;

const styles = StyleSheet.create({
  textColor: {
    color: '#57606F',
    textAlign: 'center',
  },
  icon: {alignSelf: 'center', marginTop: 5, color: '#063197'},
});
