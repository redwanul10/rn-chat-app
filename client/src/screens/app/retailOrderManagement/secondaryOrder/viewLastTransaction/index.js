import React, { useState, useEffect, useContext } from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
} from 'react-native';
import CommonTopBar from '../../../../../common/components/CommonTopBar';
import { _dateFormatter } from '../../../../../common/functions/_dateFormatter';
import { _todayDate } from '../../../../../common/functions/_todayDate';

import { GlobalState } from '../../../../../GlobalStateProvider';
import { GetOutletPreviousItemTransaction_api } from '../helper';

const title = 'Show Transaction';



function ViewLastTransaction({ route: { params } }) {
    const { profileData, selectedBusinessUnit } = useContext(GlobalState);
    const [select, setSelect] = useState(true);

    const [outletPrvItemTrans, setOutletPrvItemTrans] = useState([]);


    const [itemInfo, setItemInfo] = useState([]);

    useEffect(() => {
        // if (params?.territoryName?.value && params?.outlet?.value) {
        GetOutletPreviousItemTransaction_api(
            profileData?.accountId,
            selectedBusinessUnit?.value,
            params?.territory?.value,
            params?.outlet?.value,
            _todayDate(),
            setOutletPrvItemTrans
        );
        // }
    }, [profileData, selectedBusinessUnit, params]);

    // const saveHandler = (values, cb) => {};



    return (
        <>
            <ScrollView contentContainerStyle={{ backgroundColor: '#F4F6FC', flex: 1 }}>
                <CommonTopBar title={title} />

                <View>
                    {outletPrvItemTrans?.map((item, index) => (
                        <View
                            key={index}
                            style={[
                                styles.selectItemStyle,
                                {
                                    marginBottom: 5,
                                    backgroundColor: '#ffffff',
                                    borderRadius: 7,
                                    padding: 10,
                                },
                            ]}>
                            {/* <Text style={styles.categoryText}>A</Text> */}

                            <View
                                style={{
                                    alignSelf: 'flex-start',
                                    width: '70%',
                                }}>
                                {/* <Text>{index + 1} </Text> */}

                                <Text style={{ fontWeight: 'bold' }}>

                                    {_dateFormatter(item?.deliveryDate)}
                                </Text>

                            </View>

                            <View>
                                <Text style={{ fontWeight: 'bold', alignSelf: 'center' }}>
                                    Transaction QTY
                                </Text>
                                <Text style={{ fontWeight: 'bold', alignSelf: 'center' }}>
                                    {item?.transactionQTY}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </>
    );
}

export default ViewLastTransaction;
const styles = StyleSheet.create({
    availableBalanceSection: {
        alignItems: 'center',
        marginTop: 20,
    },
    availableBalanceAmount: {
        color: '#2ED573',
        fontSize: 25,
        fontWeight: 'bold',
    },
    divider: {
        backgroundColor: '#DFDFDF',
        height: 2,
    },
    teritoryStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 10,
        marginTop: 20,
    },
    selectItemStyle: {
        flexDirection: 'row',
        backgroundColor: '#DFDFDF',
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
    },
    notSelectedStyle: {
        flexDirection: 'row',

        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        height: 30,
        padding: 5,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
    },
    categoryText: {
        margin: 10,
        fontWeight: 'bold',
        fontSize: 15,
    },
    textInputView: {
        borderColor: '#000000',
        borderWidth: 1,
        borderRadius: 5,
        flexDirection: 'row',
        height: 20,
    },
    textInputStyle: {
        width: 30,
        fontSize: 14,
        paddingVertical: -5,
        textAlignVertical: 'top',
    },
    selectItemBar: {
        backgroundColor: '#DFDFDF',
        height: 2,
        borderBottomRightRadius: 26,
        borderBottomLeftRadius: 26,
    },
    btnStyle: {
        backgroundColor: '#3A405A',
        position: 'absolute',
        top: '80%',
        left: '10%',
        alignItems: 'center',
        // marginHorizontal: '7%',
        // marginVertical: 15,
        width: '80%',
        flexDirection: 'row',
        height: 50,

        borderRadius: 25,
        justifyContent: 'space-evenly',
    },
    btnCircle: {
        width: 25,
        height: 25,
        backgroundColor: '#3A405A',
        borderRadius: 15,
        marginHorizontal: 5,
        borderColor: '#fff',
        borderWidth: 2,
    },
});
