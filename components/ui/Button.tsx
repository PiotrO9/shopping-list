import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

type ButtonProps = {
	title: string;
	onPress: () => void;
	variant?: 'primary' | 'danger' | 'success';
	size?: 'small' | 'medium' | 'large';
	style?: ViewStyle;
	textStyle?: TextStyle;
	disabled?: boolean;
	accessibilityLabel?: string;
};

function Button({
	title,
	onPress,
	variant = 'primary',
	size = 'medium',
	style,
	textStyle,
	disabled = false,
	accessibilityLabel,
}: ButtonProps) {
	
	const getBackgroundColor = () => {
		if (disabled) return '#cccccc';
		
		switch (variant) {
			case 'primary': return '#4CAF50';
			case 'danger': return '#F44336';
			case 'success': return '#8BC34A';
			default: return '#4CAF50';
		}
	};
	
	const getSizeStyles = (): ViewStyle => {
		switch (size) {
			case 'small': return { paddingVertical: 6, paddingHorizontal: 12 };
			case 'large': return { paddingVertical: 14, paddingHorizontal: 20 };
			default: return { paddingVertical: 10, paddingHorizontal: 16 };
		}
	};
	
	const getTextSize = (): TextStyle => {
		switch (size) {
			case 'small': return { fontSize: 14 };
			case 'large': return { fontSize: 18 };
			default: return { fontSize: 16 };
		}
	};

	return (
		<TouchableOpacity
			style={[
				styles.button,
				{ backgroundColor: getBackgroundColor() },
				getSizeStyles(),
				style,
			]}
			onPress={onPress}
			disabled={disabled}
			activeOpacity={0.7}
			accessibilityRole="button"
			accessibilityLabel={accessibilityLabel || title}
		>
			<Text style={[styles.text, getTextSize(), textStyle]}>
				{title}
			</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	button: {
		borderRadius: 4,
		alignItems: 'center',
		justifyContent: 'center',
	},
	text: {
		color: 'white',
		fontWeight: '600',
	},
});

export default Button; 