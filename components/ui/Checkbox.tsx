import React from 'react';
import { View, StyleSheet } from 'react-native';

type CheckboxProps = {
	checked: boolean;
	color?: string;
};

function Checkbox({ checked, color = '#4CAF50' }: CheckboxProps) {
	return (
		<View style={[
			styles.checkbox, 
			{ borderColor: color },
			checked && { backgroundColor: color }
		]}>
			{checked && <View style={styles.checkmark} />}
		</View>
	);
}

const styles = StyleSheet.create({
	checkbox: {
		width: 24,
		height: 24,
		borderRadius: 12,
		borderWidth: 2,
		justifyContent: 'center',
		alignItems: 'center',
	},
	checkmark: {
		width: 12,
		height: 6,
		borderLeftWidth: 2,
		borderBottomWidth: 2,
		borderColor: 'white',
		transform: [{ rotate: '-45deg' }],
	},
});

export default Checkbox; 