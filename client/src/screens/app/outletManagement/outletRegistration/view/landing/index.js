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

function ViewOutletProfile({route: {params}, navigation}) {
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
      2 || profileData?.accoundId,
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

    const objAttr = outletProfileType?.map((item) => {
      const {objAttribute} = item;

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
          ? +fieldValue
          : fieldValue,
        attributeValueDate: isDate ? fieldValue : '',
        actionBy: profileData?.userId,
      };
    });

    const payload = {
      objProfile: {
        outletID: +params?.id,
        strOwnerName: outletInfo?.ownerName || '',
        strOutletAddress: outletInfo?.outletAddress || '',
        maritatualStatusId: ownerInfo?.marriageStatus?.value,
        maritatualStatus: ownerInfo?.marriageStatus?.label,
        actionBy: profileData?.userId,
        dateOfBirth: ownerInfo?.dateOfBirth,
        marriageDate: '1970-01-01',
        emailAddress: ownerInfo?.email,
        latitude: outletInfo?.lattitude,
        longitude: outletInfo?.longitude,
        outletImagePath: '',
        contactType: ownerInfo?.contactType || '',
        outletImagePathNew: 'string',
        isProfileComplete: false,
        maxSalesItem: 6965,
        maxSalesItemName: 'Vasundhara packaging papers',
        tradeLicenseNo: outletInfo?.tradeLicenseNo || '',
        ownerNIDNo: ownerInfo?.ownerNid,
        monMonthlyAvgSales: +outletInfo?.avarageAmount,
      },
      objAttr,
    };

    editOutletProfile(payload, setLoading);
  };

  return (
    <>
      <CommonTopBar />

      <View style={{padding: 20}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          {/* Outlet Info */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('View Outlet Info', {
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
              navigation.navigate('View Owner Info', {
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
              navigation.navigate('View Business Info', {
                businessInfo: outletProfile?.businessInfo,
                onUpdateHandler,
              });
            }}>
            <Image source={require('../../../../../../assets/edit_three.png')} />
            <Text style={styles.textColor}>Business Information</Text>
            {isBusinessInfoDone && (
              <Icon style={styles.icon} name="checkcircleo" size={17} />
            )}
          </TouchableOpacity>
          <Text></Text>
        </View>
      </View>
    </>
  );
}

export default ViewOutletProfile;

const styles = StyleSheet.create({
  textColor: {
    color: '#57606F',
    textAlign: 'center',
  },
  icon: {alignSelf: 'center', marginTop: 5, color: '#063197'},
});
