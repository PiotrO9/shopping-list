import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

type CardProps = {
	children: React.ReactNode;
	style?: ViewStyle;
	elevation?: number;
	rounded?: boolean;
	padding?: 'none' | 'small' | 'medium' | 'large';
	backgroundColor?: string;
};

function Card({
	children,
	style,
	elevation = 2,
	rounded = true,
	padding = 'medium',
	backgroundColor = 'white',
}: CardProps) {
	
	const getPadding = (): number => {
		switch (padding) {
			case 'none': return 0;
			case 'small': return 8;
			case 'large': return 24;
			default: return 16;
		}
	};
	
	return (
		<View
			style={[
				styles.card,
				{
					backgroundColor,
					padding: getPadding(),
					borderRadius: rounded ? 8 : 0,
					elevation,
					shadowOpacity: elevation * 0.1,
				},
				style,
			]}
		>
			{children}
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowRadius: 3,
		marginVertical: 8,
		marginHorizontal: 2,
	},
});

export default Card; 