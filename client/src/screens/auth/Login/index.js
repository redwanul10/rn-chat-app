import {Formik} from 'formik';
import React, {useState, useEffect, useContext} from 'react';
import {
  // Text,
  Image,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Linking,
  SafeAreaView,
  Platform,
} from 'react-native';
import * as Yup from 'yup';
import FormInputSignIn from '../../../common/components/TextInputSignIn';
import {loginAction, getUserRoleInfo, getEmployeeTerritoryInfo} from './helper';
import {getGlobalData} from '../../../common/functions/localStorage';
import {Button, Spinner} from 'native-base';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import ICheckbox from '../../../common/components/ICheckbox';
import {GlobalState} from '../../../GlobalStateProvider';
import checkVersion from 'react-native-store-version';
import Text from '../../../common/components/IText';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

const initValues = {
  email: '',
  password: '',
};

const schemaValidation = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Must be 8 Character')
    .required('Password is Required'),
  email: Yup.string().email('Invalid Email').required('Email is Required'),
});

export default function Login({navigation, route: {params}}) {
  const {saveUserData} = useContext(GlobalState);
  const [globalData, setGlobalData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [remember, setRemember] = useState(true);
  const [showPass, setShowPass] = useState(true);
  const [isLatest, setLatest] = useState(false);

  // Check update in play store
  const onStoreButtonPress = () => {
    // if (Platform.OS === 'ios') {
    // Linking.openURL('https://itunes.apple.com/app/id1321198947?mt=8');
    // } else {
    Linking.openURL(
      'https://play.google.com/store/apps/details?id=com.ibos_rtm',
    );
    // }
  };

  useEffect(() => {
    getGlobalData(setGlobalData);
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const check = await checkVersion({
          // ===== Play Store Version | Version Will change from Here =====
          version: '2.0.5',
          // iosStoreURL: 'https://itunes.apple.com/jp/app/kokura-keirin/id1444261040',
          androidStoreURL:
            'https://play.google.com/store/apps/details?id=com.ibos_rtm',
        });

        if (check.result === 'new') {
          setLatest(true);
        } else {
          // alert('hello');
        }
      } catch (e) {}
    };

    init();
  }, []);

  // Modal box off method
  const modalOff = () => {
    setLatest(false);
  };

  return (
    <SafeAreaView>
      {/* ------ Play Store Update Modal -------- */}
      {/* <Modal animationType="fade" transparent visible={isLatest}>
        <View style={styles.centeredView}>
          <View style={styles.modalStyle}>
            <Text style={styles.updateAvailable}>
              A new update is available
            </Text>

            <View style={styles.updateButtons}>
              <TouchableOpacity
                style={[styles.updateButtonStyle, {backgroundColor: '#063197'}]}
                onPress={onStoreButtonPress}>
                <Text style={{color: 'white', textAlign: 'center'}}>
                  UPDATE
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal> */}
      <KeyboardAwareScrollView>
        <TouchableWithoutFeedback onPress={(e) => Keyboard.dismiss()}>
          <>
            {/* login banner image */}
            <Image
              resizeMode="stretch"
              style={{top: -100, width: '105%'}}
              source={require('../../../assets/login_banner.png')}
            />
            <Image
              resizeMode="stretch"
              style={{
                marginTop: -140,
                marginBottom: -40,

                alignSelf: 'center',
                width: 250,
                height: 180,
              }}
              source={require('../../../assets/AFBL.png')}
            />
            <Text
              style={{
                fontWeight: 'bold',
                alignSelf: 'center',
                marginTop: -20,
                marginBottom: 10,
              }}>
              AKIJ FOOD & BEVERAGE LIMITED
            </Text>
            {/* <Text>{JSON.stringify(params?.value)}</Text> */}

            {/* sign in text and subtext */}
            <View style={{}}>
              <View style={{left: 15, marginBottom: 10}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.signinText}>Sign in</Text>
                </View>

                <Text style={styles.subText}>
                  Please sign in with your credentials
                </Text>
              </View>

              {/* email,pass,login button field */}
              <View>
                <Formik
                  enableReinitialize={true}
                  initialValues={{
                    ...initValues,
                    email:
                      globalData?.profileData?.emailAddress ||
                      initValues?.email,
                    password: params?.resetPassword
                      ? ''
                      : globalData?.password || initValues?.password,
                  }}
                  validationSchema={schemaValidation}
                  onSubmit={(values, {resetForm}) => {
                    const {email, password} = values;
                    const customcb = async (userInfo) => {
                      // resetForm();
                      saveUserData(userInfo);

                      try {
                        // Last Change
                        const territoryInfo = await getEmployeeTerritoryInfo(
                          userInfo?.profileData?.accountId,
                          userInfo?.selectedBusinessUnit?.value,
                          userInfo?.profileData?.employeeId,
                        );

                        // detect if a user TSM or SO
                        // Save user info in global state
                        getUserRoleInfo(
                          userInfo?.profileData?.accountId,
                          userInfo?.selectedBusinessUnit?.value,
                          userInfo?.profileData?.employeeId,
                          (userRoleInfo) => {
                            saveUserData({
                              ...userInfo,
                              userRoleInfo,
                              userRole: userRoleInfo?.soMenuAllow
                                ? 'SO'
                                : 'TSM',
                              territoryInfo: territoryInfo || [], // Last Change
                            });
                          },
                        );
                        navigation.navigate('Home');
                      } catch (err) {}
                    };
                    loginAction(email, password, setIsLoading, customcb);
                  }}>
                  {(formikProps) => (
                    <View>
                      <View style={{top: 15, marginHorizontal: 15}}>
                        {/* <Icon name="user-o" /> */}
                        <FormInputSignIn
                          name="email"
                          label="Email"
                          placeholder="Enter email"
                          initialIcon="user-circle-o"
                          formikProps={formikProps}
                        />

                        <FormInputSignIn
                          name="password"
                          label="Password"
                          placeholder="Enter password"
                          formikProps={formikProps}
                          initialIcon="lock"
                          endIcon="eye"
                          iconStyle={{marginHorizontal: 5}}
                          secureTextEntry={showPass}
                          togglePassword={() => {
                            setShowPass(!showPass);
                          }}
                        />
                      </View>
                      <View style={styles.remembrnForgot}>
                        <View style={styles.checkBoxStyle}>
                          <ICheckbox
                            checked={remember}
                            onPress={(e) => setRemember(!remember)}
                          />
                          <Text style={{}}>Remember</Text>
                        </View>

                        <TouchableOpacity style={styles.forgotPass}>
                          <Text style={{fontFamily: 'OpenSans-Light'}}>
                            Forgot Password?
                          </Text>
                        </TouchableOpacity>
                      </View>

                      <Button
                        block
                        style={styles.btnStyle}
                        onPress={(e) => {
                          formikProps.handleSubmit();
                        }}>
                        <Text style={[styles.loginBtn, styles.fontFamilyStyle]}>
                          LOG IN
                        </Text>

                        {isLoading && (
                          <Spinner
                            color="white"
                            style={{transform: [{scaleX: 0.6}, {scaleY: 0.6}]}}
                          />
                        )}
                      </Button>
                    </View>
                  )}
                </Formik>
              </View>

              {/* go to sign up page */}
              <View style={styles.dontHave}>
                <Text style={{color: 'grey', fontFamily: 'OpenSans-Light'}}>
                  Don't have an account?
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Sign Up')}>
                  <Text style={styles.fontFamilyStyle}> Sign up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  signinText: {
    color: '#222B45',
    fontSize: 40,
    fontFamily: 'OpenSans-Bold',
  },
  subText: {
    color: '#222B45',
    fontSize: 15,
    // fontFamily: "OpenSans-Light",
  },
  remembrnForgot: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 30,
    marginHorizontal: '5%',
  },
  checkBoxStyle: {
    flexDirection: 'row',
    marginRight: '35%',
  },
  forgotPass: {
    borderBottomWidth: 2,
    borderColor: 'grey',
    marginRight: 10,
  },
  btnStyle: {
    backgroundColor: '#063197',
    width: '92%',
    borderRadius: 3,
    opacity: 0.9,
    alignSelf: 'center',
  },
  loginBtn: {
    color: 'white',
    fontSize: 16,
  },
  dontHave: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 12,
  },
  fontFamilyStyle: {
    fontFamily: 'OpenSans-Bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121E4499',
  },
  modalStyle: {
    width: 340,
    height: 183,
    backgroundColor: '#fff',
    borderRadius: 15,
  },
  updateAvailable: {
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 27,
    fontSize: 20,
    color: '#063197',
    fontWeight: 'bold',
  },
  updateButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 0,
  },
  updateButtonStyle: {
    width: 100,
    margin: 2,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 15,
  },
});
