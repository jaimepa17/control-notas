import { Platform } from 'react-native';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

export const getNativeStackTransition = (): Partial<NativeStackNavigationOptions> => {
  return {
    animation: Platform.select({
      ios: 'slide_from_right',
      android: 'slide_from_right',
      default: 'slide_from_right',
    }),
    animationDuration: Platform.select({
      ios: 350,
      android: 250,
      default: 250,
    }),
  };
};

export const getFadeTransition = (): Partial<NativeStackNavigationOptions> => {
  return {
    animation: 'fade',
    animationDuration: 200,
  };
};
