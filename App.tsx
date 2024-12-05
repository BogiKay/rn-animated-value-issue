import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  Pressable,
  View,
  useAnimatedValue,
  Text,
  Platform,
} from 'react-native';

type Props = {
  elevation?: Animated.Value;
  label: string;
  disabled?: boolean;
  onPress: () => void;
};

const elevationLevel = [0, 3, 6, 9, 12, 15];
const inputRange = [0, 1, 2, 3, 4, 5];

const MyButton = ({elevation, label, disabled, onPress}: Props) => {
  const style = {
    ...(elevation &&
      Platform.OS === 'android' && {
        elevation: elevation.interpolate({
          inputRange,
          outputRange: elevationLevel,
        }),
      }),
    ...(elevation &&
      Platform.OS === 'ios' && {
        shadowColor: '#000',
        shadowOpacity: elevation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.3],
          extrapolate: 'clamp',
        }),
        shadowOffset: {
          width: 0,
          height: elevation.interpolate({
            inputRange,
            outputRange: [0, 1, 1, 1, 2, 4],
          }),
        },
        shadowRadius: elevation.interpolate({
          inputRange,
          outputRange: [0, 1, 2, 3, 3, 4],
        }),
      }),
  };

  return (
    <Pressable onPress={onPress} disabled={disabled}>
      <Animated.View
        style={[styles.button, disabled && styles.disabledButton, style]}>
        <Text>{label}</Text>
      </Animated.View>
    </Pressable>
  );
};

function App(): React.JSX.Element {
  const [disabled, setDisabled] = useState(false);
  const {current: elevation} = useRef(useAnimatedValue(0));

  // This breaks updating background of MyButton
  useEffect(() => {
    elevation.setValue(disabled ? 15 : 0);
  }, [elevation, disabled]);

  // This is working fine
  // useEffect(() => {
  //   Animated.timing(elevation, {
  //     toValue: 15,
  //     duration: 2000,
  //     useNativeDriver: true,
  //   }).start();
  // }, [elevation]);

  return (
    <SafeAreaView>
      <View style={styles.buttonContainer}>
        <MyButton
          elevation={elevation}
          label="Click to disable"
          onPress={() => setDisabled(prev => !prev)}
        />
        <MyButton
          label="Button without elevation"
          disabled={disabled}
          onPress={() => {}}
        />
        <MyButton
          elevation={elevation} // if we do not pass elevation, then background update works fine
          label="Button with elevation"
          disabled={disabled}
          onPress={() => {}}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    padding: 30,
    backgroundColor: 'white',
    height: '100%',
  },
  disabledButton: {
    backgroundColor: 'gray',
  },
  button: {
    backgroundColor: 'yellow',
    margin: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: 'blue',
    borderRadius: 10,
  },
});

export default App;
