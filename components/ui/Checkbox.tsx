import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
	useSharedValue, 
	useAnimatedStyle, 
	withTiming, 
	withSequence,
	interpolateColor,
	useAnimatedReaction,
	Easing
} from 'react-native-reanimated';

type CheckboxProps = {
	checked: boolean;
	color?: string;
};

function Checkbox({ checked, color = '#4CAF50' }: CheckboxProps) {
	const scale = useSharedValue(1);
	const checkOpacity = useSharedValue(0);
	const fillOpacity = useSharedValue(0);
	
	// React to checked changes
	useAnimatedReaction(
		() => checked,
		(isChecked, prevIsChecked) => {
			if (isChecked !== prevIsChecked) {
				if (isChecked) {
					// When checking
					scale.value = withSequence(
						withTiming(0.8, { duration: 100 }),
						withTiming(1.1, { duration: 100 }),
						withTiming(1, { duration: 150 })
					);
					fillOpacity.value = withTiming(1, { duration: 200 });
					checkOpacity.value = withTiming(1, { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
				} else {
					// When unchecking
					scale.value = withSequence(
						withTiming(1.1, { duration: 100 }),
						withTiming(0.9, { duration: 100 }),
						withTiming(1, { duration: 150 })
					);
					checkOpacity.value = withTiming(0, { duration: 200 });
					fillOpacity.value = withTiming(0, { duration: 300 });
				}
			}
		},
		[checked]
	);
	
	// Initial setup on mount
	React.useEffect(() => {
		if (checked) {
			fillOpacity.value = 1;
			checkOpacity.value = 1;
		}
	}, []);

	const animatedContainerStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: scale.value }],
			backgroundColor: interpolateColor(
				fillOpacity.value,
				[0, 1],
				['transparent', color]
			)
		};
	});

	const animatedCheckmarkStyle = useAnimatedStyle(() => {
		return {
			opacity: checkOpacity.value
		};
	});

	return (
		<Animated.View
			style={[
				styles.checkbox,
				{ borderColor: color },
				animatedContainerStyle
			]}
		>
			{checked && (
				<Animated.View style={[styles.checkmark, animatedCheckmarkStyle]} />
			)}
		</Animated.View>
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