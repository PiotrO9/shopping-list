import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

type FloatingButtonProps = {
	icon: string;
	onPress: () => void;
	color?: string;
	size?: 'small' | 'medium' | 'large';
	position?: 'bottomRight' | 'bottomLeft' | 'topRight' | 'topLeft';
	style?: ViewStyle;
	accessibilityLabel?: string;
};

function FloatingButton({
	icon,
	onPress,
	color = '#4CAF50',
	size = 'medium',
	position = 'bottomRight',
	style,
	accessibilityLabel,
}: FloatingButtonProps) {
	
	const getSize = (): ViewStyle => {
		switch (size) {
			case 'small': return { 
				width: 40, 
				height: 40,
				borderRadius: 20,
			};
			case 'large': return { 
				width: 64, 
				height: 64,
				borderRadius: 32,
			};
			default: return { 
				width: 56, 
				height: 56,
				borderRadius: 28,
			};
		}
	};
	
	const getPosition = (): ViewStyle => {
		switch (position) {
			case 'bottomLeft': return { 
				left: 20,
				bottom: 20,
			};
			case 'topRight': return { 
				right: 20,
				top: 20,
			};
			case 'topLeft': return { 
				left: 20,
				top: 20,
			};
			default: return { 
				right: 20,
				bottom: 20,
			};
		}
	};
	
	const getFontSize = (): number => {
		switch (size) {
			case 'small': return 18;
			case 'large': return 30;
			default: return 24;
		}
	};

	return (
		<TouchableOpacity
			style={[
				styles.button,
				getSize(),
				getPosition(),
				{ backgroundColor: color },
				style,
			]}
			onPress={onPress}
			activeOpacity={0.7}
			accessibilityRole="button"
			accessibilityLabel={accessibilityLabel || 'Floating action button'}
		>
			<Text style={[styles.icon, { fontSize: getFontSize() }]}>
				{icon}
			</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	button: {
		position: 'absolute',
		alignItems: 'center',
		justifyContent: 'center',
		elevation: 8,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		zIndex: 10,
	},
	icon: {
		color: 'white',
		fontWeight: 'bold',
	},
});

export default FloatingButton; 