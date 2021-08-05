import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native';
import QuantityInputBox from '../../../../../common/components/QuantityInputBox';
import Row from '../../../../../common/components/Row';
import Col from '../../../../../common/components/Col';


const ProductCard = (props) => {

    // console.log("re-rendered " + props?.index)

    return (
        <>
            <View
                style={styles.cardContainer}>
                <View style={styles.selectItemStyle}>
                    <Row>
                        {/* productImage */}
                        <Col width="15%">
                            <TouchableOpacity
                                onPress={props?.onImagePress}>
                                <Image
                                    style={styles?.productImage}
                                    source={{
                                        uri: `https://erp.ibos.io/domain/Document/DownlloadFile?id=${props?.productImage}`,
                                    }}
                                />
                            </TouchableOpacity>
                        </Col>
                        <Col width="50%">
                            <Text style={{ fontWeight: 'bold' }}>{props?.itemName}</Text>
                            <Text style={{ fontWeight: 'bold' }}>
                                Rate: {props?.itemRate}
                            </Text>
                        </Col>
                        <Col
                            style={{ flexDirection: 'row', justifyContent: 'flex-end' }}
                            width="35%">
                            <QuantityInputBox
                                value={props?.quantity?.toString()}
                                onChange={props?.onChange}
                                onIncrement={props?.onIncrement}
                                onDecrement={props?.onDecrement}
                            />
                        </Col>
                    </Row>
                </View>
            </View>
        </>
    );
}

// export default ProductCard;
export default React.memo(ProductCard, (prevProps, newProps) => {
    if (prevProps?.quantity !== newProps?.quantity) {
        // console.log("quantity", prevProps?.quantity, newProps?.quantity)
        return false
    } else {
        return true
    }
});


const styles = StyleSheet.create({
    selectItemStyle: {
        padding: 5,
    },
    cardContainer: {
        marginBottom: 5,
        backgroundColor: '#ffffff',
        borderRadius: 7,
        padding: 10,
    },
    productImage: { width: 40, height: 40 }
});
