import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
} from 'react-native';
import Svg, {G, Circle} from 'react-native-svg';
import {btnBgSecondary} from '../theme/color';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedText = Animated.createAnimatedComponent(Text);

export default function DonutChart({
  // percentage = 85,
  radius = 75,
  strokeWidth = 25,
  duration = 800,
  color = btnBgSecondary,
  delay = 600,
  textColor,
  max = 100,
  ...props
}) {
  const percentage = props?.percentage || 0;
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const circleRef = React.useRef();
  const inputRef = React.useRef();
  const halfCircle = radius + strokeWidth;
  const circleCircumference = 2 * Math.PI * radius;
  const animation = (toValue) => {
    return Animated.timing(animatedValue, {
      toValue,
      duration,
      delay,
      useNativeDriver: true,
    }).start(() => {
      // animation(toValue === 0 ? percentage : percentage);
    });
  };
  React.useEffect(() => {
    if (percentage > 100) {
      animation(100);
    } else {
      animation(percentage);
    }

    animatedValue.addListener((v) => {
      if (circleRef?.current) {
        const maxPerc = (100 * v.value) / max;
        const strokeDashoffset =
          circleCircumference - (circleCircumference * maxPerc) / 100;

        circleRef.current.setNativeProps({
          strokeDashoffset,
        });
      }

      if (inputRef?.current) {
        inputRef.current.setNativeProps({
          text: `${Math.round(v.value)}%`,
        });
      }
    });
  });

  return (
    <View style={{alignItems: 'center'}}>
      <Svg
        width={radius * 2}
        height={radius * 2}
        viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}>
        <G rotation="90" origin={`${halfCircle}, ${halfCircle}`}>
          <Circle
            cx="50%"
            cy="50%"
            stroke={color}
            strokeWidth={strokeWidth}
            r={radius}
            fill="transparent"
            strokeOpacity={0.2}
          />
          <AnimatedCircle
            ref={circleRef}
            cx="50%"
            cy="50%"
            stroke={color}
            strokeWidth={strokeWidth}
            r={radius}
            fill="transparent"
            strokeOpacity={0.5}
            strokeDasharray={circleCircumference}
            strokeDashoffset={circleCircumference}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      <Text
        style={[
          StyleSheet.absoluteFillObject,
          {
            top: 60,
            fontSize: radius / 5,
            color: btnBgSecondary,
            textAlign: 'center',
            marginBottom: 8,
            fontWeight: 'bold',
          },
        ]}>
        Total Target
      </Text>
      {/* <TextInput
    editable={false}
    defaultValue="Total Target"
    style={[
      StyleSheet.absoluteFillObject,
      {
        fontSize: radius / 5,
        color: '#000',
        textAlign: 'center',
        marginBottom: 8,
      },
    ]}
  /> */}

      <AnimatedText
        style={[
          StyleSheet.absoluteFillObject,
          {fontSize: radius / 5, color: 'black'},
          {fontWeight: 'bold', textAlign: 'center', marginTop: 80},
        ]}>
        {props?.totalTarget || percentage}
      </AnimatedText>
    </View>
  );
}
