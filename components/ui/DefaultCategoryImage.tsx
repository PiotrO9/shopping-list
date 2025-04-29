import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type DefaultCategoryImageProps = {
  category?: string;
};

function DefaultCategoryImage({ category }: DefaultCategoryImageProps) {
  const initials = category
    ? category
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '??';

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#757575',
  },
});

export default DefaultCategoryImage; 