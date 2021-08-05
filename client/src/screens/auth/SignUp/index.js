import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {Formik} from 'formik';
import FormInput from '../../../common/components/TextInput';
import {Button} from 'native-base';

const initValues = {
  email: '',
  password: '',
};

function SignUp({navigation}) {
  return (
    <ScrollView>
      <StatusBar backgroundColor="#3A405A" />
      {/* sign up page banner */}
      <View style={{width: '100%'}}>
        <Image
          resizeMode="stretch"
          style={{top: -90, width: '105%'}}
          source={require('../../../assets/signup_banner.png')}
        />
      </View>

      {/* sign up text and subtext */}
      <View style={styles.signUpBox}>
        <Text style={styles.signinText}>Sign up</Text>
        <Text style={styles.subText}>Please sign up with your credentials</Text>
      </View>

      {/* form for sign up */}
      <View style={styles.formBoxStyle}>
        <Formik enableReinitialize={true} initialValues={{...initValues}}>
          {(formikProps) => (
            <View>
              <View style={{flexDirection: 'row'}}>
                <FormInput
                  name="first_name"
                  label="First Name"
                  placeholder="Enter name"
                  containerStyle={{flex: 1, marginHorizontal: '2%'}}
                  formikProps={formikProps}
                />

                <FormInput
                  name="last_name"
                  label="Last Name"
                  placeholder="Enter name"
                  containerStyle={{flex: 1, marginHorizontal: '2%'}}
                  formikProps={formikProps}
                />
              </View>

              <FormInput
                name="email"
                label="Email"
                placeholder="Enter email"
                containerStyle={{flex: 1, marginHorizontal: '2%'}}
                formikProps={formikProps}
              />
              <FormInput
                name="password"
                label="Password"
                placeholder="Enter Password"
                containerStyle={{flex: 1, marginHorizontal: '2%'}}
                formikProps={formikProps}
              />
              <FormInput
                name="confirm_password"
                label="Confirm Password"
                placeholder="Enter Password"
                containerStyle={{flex: 1, marginHorizontal: '2%'}}
                formikProps={formikProps}
              />

              <Button block style={styles.signUpBtn}>
                <Text style={styles.signUpText}>SIGN UP</Text>
              </Button>
            </View>
          )}
        </Formik>
      </View>
      {/* Go to sign in page */}
      <View style={styles.goToSignIn}>
        <Text style={{color: 'grey', }}>
          Already have an account?
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Log in')}>
          <Text style={{}}> Sign in</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default SignUp;
const styles = StyleSheet.create({
  signUpBox: {
    left: 15,
    marginBottom: 10,
    top: -90,
  },
  signinText: {
    color: '#222B45',
    fontSize: 40,
    // fontFamily: 'HelveticaNeueBd',
  },
  subText: {
    color: '#222B45',
    fontSize: 15,
    // fontFamily: 'HelveticaNeue',
  },
  formBoxStyle: {
    paddingHorizontal: 10,
    marginBottom: 20,
    top: -80,
  },
  signUpBtn: {
    backgroundColor: '#3A405A',
    width: '96%',
    borderRadius: 3,
    alignSelf: 'center',
  },
  signUpText: {
    color: 'white',
    fontSize: 16,
    // fontFamily: 'HelveticaNeueBd',
  },
  goToSignIn: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: -90,
    marginBottom: 30,
  },
});
