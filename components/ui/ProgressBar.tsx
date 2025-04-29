import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

type ProgressBarProps = {
	progress: number;
	color?: string;
	backgroundColor?: string;
	height?: number;
};

function ProgressBar({ 
	progress, 
	color = '#4CAF50', 
	backgroundColor = '#e0e0e0',
	height = 4 
}: ProgressBarProps) {
	const width = React.useRef(new Animated.Value(0)).current;

	React.useEffect(() => {
		Animated.timing(width, {
		toValue: progress,
		duration: 300,
		useNativeDriver: false,
		}).start();
	}, [progress]);

	return (
		<View style={[styles.container, { height, backgroundColor }]}>
		<Animated.View 
			style={[
			styles.progress, 
			{ 
				backgroundColor: color,
				width: width.interpolate({
				inputRange: [0, 1],
				outputRange: ['0%', '100%'],
				}),
			}
			]} 
		/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		borderRadius: 2,
		overflow: 'hidden',
	},
	progress: {
		height: '100%',
		borderRadius: 2,
	},
});

export default ProgressBar; 