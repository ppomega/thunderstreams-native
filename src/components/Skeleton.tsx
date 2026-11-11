import { useEffect, useRef } from 'react';
import { Animated, type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../context/Theme';

export function Skeleton({
  width = '100%',
  height,
  radius = 16,
  style,
}: {
  width?: DimensionValue;
  height: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0.5)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.5, duration: 800, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);
  return (
    <Animated.View
      style={[{ width, height, borderRadius: radius, backgroundColor: colors.skeleton, opacity }, style]}
    />
  );
}
