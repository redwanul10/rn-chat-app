import {Spinner} from 'native-base';
import React, {useState, useRef} from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  View,
  StyleSheet,
  Text as nativeText,
  Modal,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ViewPropTypes,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import SearchBar from './SearchBar';
import Text from './IText';

let timeout = null;

const ICustomPicker = (props) => {
  const {
    placeholder,
    onSearchDelay,
    disableOnScrollEnd,
    placeholderStyle,
    selectedLabelStyle,
    modalContentContainerStyle,
    formikProps,
    name,
    label,
    wrapperStyle,
    wrapperFullStyle,
    value,
    labelStyle,
    secureTextEntry,
    options,
    onChange,
    onSearch,
    disabled,
    loading,
  } = props;

  const [modalActive, setModalActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [enableReached, setEnableReached] = useState(false);
  const [itemHeight, setItemHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  const flatListRef = useRef();

  const isError =
    formikProps?.touched[name] && formikProps?.errors[name] ? true : false;

  const handleSelect = (item) => {
    setModalActive(false);
    if (onChange) {
      onChange(item);
    } else {
      formikProps?.setFieldValue(name, item);
    }
  };

  const handleScroll = (e) => {
    if (disableOnScrollEnd) return;
    const height = itemHeight + (props.itemMargin || 0); //(itemHeight * 99.5) / 100;
    const half = height * filteredOptions.length;

    if (e.nativeEvent.contentOffset.y > half - contentHeight - 10) {
      if (enableReached) {
        setEnableReached(false);
        props?.onScrollEnd();
      }
    } else {
      if (!enableReached) setEnableReached(true);
    }
  };

  const setSearchWithCallback = (value) => {
    setSearchTerm(value);
    if (!onSearch) return;
    if (timeout) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        onSearch(value);
      }, onSearchDelay);
    } else {
      timeout = setTimeout(() => {
        onSearch(value);
      }, onSearchDelay);
    }
  };
  const filteredOptions =
    !searchTerm || onSearch
      ? options
      : options?.filter((item) =>
          item?.label?.toLowerCase()?.includes(searchTerm?.toLowerCase()),
        );
  return (
    <>
      <View
        style={[
          style.inputWrapper,
          {
            borderBottomWidth: isError ? 1.5 : 0,
            borderColor: isError ? 'red' : 'rgba(99, 99, 99,0.2)',
          },
          wrapperFullStyle,
        ]}>
        {/* { color: isError ? "red" : "#636363" } */}
        {label ? (
          <Text
            style={[
              labelStyle || {},
              {fontFamily: 'OpenSans-Bold', color: isError ? 'red' : 'black'},
            ]}>
            {label}
          </Text>
        ) : null}

        <TouchableOpacity
          // style={disabled ? style.disabled : {}}
          onPress={(e) => setModalActive(true)}
          disabled={disabled}>
          <View
            style={[
              style.box,
              {
                backgroundColor: '#ffffff',
                borderRadius: 5,
              },
              wrapperStyle || {},
              disabled ? style.disabled : {},
            ]}>
            <Text
              numberOfLines={1}
              style={[
                style.label,
                placeholderStyle || {},
                selectedLabelStyle || {},
              ]}>
              {value?.label || formikProps?.values[name]?.label || placeholder || 'Select'}
            </Text>
            {props.icon()}
          </View>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalActive}
        transparent={true}
        animationType="fade"
        onRequestClose={(e) => setModalActive(false)}>
        <TouchableWithoutFeedback onPress={(e) => setModalActive(false)}>
          <View style={style.modalWrapper}>
            <TouchableWithoutFeedback onPress={(e) => false}>
              {/* Modal Inner Content */}
              <View style={[style.modalInner, modalContentContainerStyle]}>
                <View style={styles.container}>
                  {/* picker sarchbar */}
                  {props?.showSearchBar &&
                    props?.customSearchBar(searchTerm, setSearchWithCallback)}
                </View>

                {/* Emty Option Message */}
                {options?.length === 0 && (
                  <View
                    style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={[style.item]}>No Data Found</Text>
                  </View>
                )}

                {/* List of Options */}
                <FlatList
                  ref={flatListRef}
                  data={filteredOptions}
                  extraData={searchTerm}
                  keyExtractor={(item, i) => item?.label + i.toString()}
                  bounces={false}
                  showsVerticalScrollIndicator={true}
                  onScroll={handleScroll}
                  onLayout={(e) => {
                    setContentHeight(e.nativeEvent?.layout.height);
                  }}
                  renderItem={({item, index}) => (
                    <TouchableWithoutFeedback
                      style={[{height: itemHeight || 'auto'}]}
                      onPress={(e) => handleSelect(item)}
                      disabled={item?.disabled}
                      onLayout={(e) => {
                        if (!itemHeight)
                          setItemHeight(
                            Math.round(e.nativeEvent?.layout.height),
                          );
                      }}>
                      <View
                        style={[
                          {
                            height: itemHeight || 'auto',
                            borderBottomWidth: 1,
                            borderColor:
                              formikProps?.values[name]?.value === item?.value
                                ? 'black'
                                : '#E4E9F2',
                          },
                          item?.disabled ? style.disabled : {},
                        ]}>
                        {props?.renderItem(item, index)}
                      </View>
                    </TouchableWithoutFeedback>
                  )}
                />
                {/* Loaidng Indicator */}
                {props?.loading && props?.customLoading()}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Error Message */}
      {formikProps &&
        formikProps?.touched[name] &&
        formikProps?.errors[name] && (
          <Text style={style.error}>{formikProps?.errors[name]?.value}</Text>
        )}
    </>
  );
};

ICustomPicker.propTypes = {
  customSearchBar: PropTypes.elementType,
  disabled: PropTypes.bool,
  showSearchBar: PropTypes.bool,
  itemMargin: PropTypes.number,
  renderItem: PropTypes.elementType,
  loading: PropTypes.bool,
  customLoading: PropTypes.elementType,
  icon: PropTypes.elementType,
  onScrollEnd: PropTypes.func,
  onSearch: PropTypes.func,
  disableOnScrollEnd: PropTypes.bool,
  onSearchDelay: PropTypes.number,
  placeholderStyle: nativeText.propTypes.style,
  selectedLabelStyle: nativeText.propTypes.style,
  modalContentContainerStyle: ViewPropTypes.style,
};

ICustomPicker.defaultProps = {
  showSearchBar: true,
  disabled: false,
  itemMargin: 0,
  onSearchDelay: 800,
  customSearchBar: (searchTerm, setSearchTerm) => (
    <SearchBar
      value={searchTerm}
      onChangeText={(text) => {
        setSearchTerm(text);
      }}
    />
  ),
  renderItem: (item, index) => (
    <>
      <Text style={[style.item]}>
        {index + 1}. {item?.label}
      </Text>
    </>
  ),
  loading: false,
  disableOnScrollEnd: true,
  customLoading: () => <Spinner color="black" />,
  icon: () => (
    <Icon
      style={{position: 'absolute', right: 10, bottom: 10}}
      name="caretdown"
      color="black"
      size={14}
    />
  ),
  onScrollEnd: () => {},
  // onSearch: () => {},
};

export default ICustomPicker;

const style = StyleSheet.create({
  label: {
    fontSize: 14,
    width: '90%',
  },
  error: {
    color: 'red',
    fontSize: 10,
    marginTop: -8,
    marginBottom: 5,
  },
  inputWrapper: {
    marginBottom: 10,
  },

  input: {
    padding: 0,
    color: 'black',
  },
  modalWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    marginVertical: 5,
    borderRadius: 10,
    // backgroundColor: "#0000000F",
    padding: 9,
    paddingLeft: 12,
  },
  modalInner: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    width: '90%',
    height: '80%',
    // height: 300,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  item: {
    paddingVertical: 15,
    fontSize: 17,
    // borderBottomWidth: 1,
    // borderColor: '#E4E9F2',
  },
  disabled: {backgroundColor: 'rgba(99, 99, 99,0.2)'},
});

const styles = StyleSheet.create({
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: 'transparent',
    elevation: 2,
    width: '100%',
    height: 40,
    borderRadius: 5,
    marginBottom: 10,
  },

  ImageStyle: {
    padding: 10,
    margin: 5,
  },
});
