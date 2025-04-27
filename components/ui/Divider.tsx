import React from 'react';
import { View, StyleSheet, ViewStyle, DimensionValue } from 'react-native';

type DividerProps = {
  style?: ViewStyle;
  color?: string;
  thickness?: number;
  orientation?: 'horizontal' | 'vertical';
  length?: DimensionValue;
  margin?: number;
};

function Divider({
  style,
  color = '#E0E0E0',
  thickness = 1,
  orientation = 'horizontal',
  length,
  margin = 8,
}: DividerProps) {
  const isHorizontal = orientation === 'horizontal';
  
  const dividerStyle = {
    backgroundColor: color,
    ...(isHorizontal
      ? {
          height: thickness,
          width: length || '100%' as DimensionValue,
          marginVertical: margin,
        }
      : {
          width: thickness,
          height: length || '100%' as DimensionValue,
          marginHorizontal: margin,
        }),
  };

  return <View style={[styles.divider, dividerStyle, style]} />;
}

const styles = StyleSheet.create({
  divider: {
    alignSelf: 'center',
  },
});

export default Divider; 