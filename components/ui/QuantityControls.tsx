import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Animated, { 
	useSharedValue, 
	useAnimatedStyle, 
	withTiming, 
	withSequence,
	withSpring,
	Easing
} from 'react-native-reanimated';

type QuantityControlsProps = {
	quantity: number;
	unit: string;
	onChangeQuantity: (newQuantity: number) => void;
	showSaveButton?: boolean;
	onSave?: () => void;
	compact?: boolean;
};

function QuantityControls({ 
	quantity, 
	unit, 
	onChangeQuantity, 
	showSaveButton = false,
	onSave,
	compact = false
}: QuantityControlsProps) {
	// Keep local state for smoother interaction
	const [localQuantity, setLocalQuantity] = useState(quantity);
	
	// Animation values
	const incrementScale = useSharedValue(1);
	const decrementScale = useSharedValue(1);
	const inputScale = useSharedValue(1);
	
	// Update local state when quantity prop changes
	useEffect(() => {
		setLocalQuantity(quantity);
	}, [quantity]);
	
	function handleQuantityChange(text: string) {
		const newValue = parseFloat(text);
		if (!isNaN(newValue) && newValue > 0) {
			setLocalQuantity(newValue);
			onChangeQuantity(newValue);
			
			// Animate input on change
			inputScale.value = withSequence(
				withTiming(1.05, { duration: 100 }),
				withTiming(1, { duration: 150 })
			);
		}
	}

	function handleIncrement() {
		const increment = getIncrementValue(localQuantity, unit);
		const newValue = parseFloat((localQuantity + increment).toFixed(2));
		setLocalQuantity(newValue);
		onChangeQuantity(newValue);
		
		// Animate the increment button
		incrementScale.value = withSequence(
			withTiming(0.85, { duration: 50 }),
			withTiming(1, { duration: 150, easing: Easing.elastic(1.2) })
		);
	}

	function handleDecrement() {
		const decrement = getIncrementValue(localQuantity, unit);
		const newValue = parseFloat((localQuantity - decrement).toFixed(2));
		const finalValue = newValue > 0 ? newValue : localQuantity;
		setLocalQuantity(finalValue);
		onChangeQuantity(finalValue);
		
		// Animate the decrement button
		decrementScale.value = withSequence(
			withTiming(0.85, { duration: 50 }),
			withTiming(1, { duration: 150, easing: Easing.elastic(1.2) })
		);
	}
	
	function getIncrementValue(value: number, unitType: string): number {
		if (unitType === 'g' || unitType === 'ml') {
			if (value >= 1000) return 500;
			else if (value >= 500) return 100;
			else if (value >= 100) return 50;
			else return 25;
		} else if (unitType === 'kg' || unitType === 'l') {
			if (value >= 5) return 1;
			else if (value >= 2) return 0.5;
			else return 0.25;
		}
		return 1; // Default for pcs, bottles, etc.
	}
	
	// Animated styles
	const animatedIncrementStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: incrementScale.value }]
		};
	});
	
	const animatedDecrementStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: decrementScale.value }]
		};
	});
	
	const animatedInputStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: inputScale.value }]
		};
	});

	return (
		<View style={[styles.container, compact && styles.compactContainer]}>
			<Animated.View style={animatedDecrementStyle}>
				<TouchableOpacity 
					style={[styles.button, compact && styles.smallButton]}
					onPress={handleDecrement}
					disabled={localQuantity <= 0.25}
				>
					<Text style={styles.buttonText}>−</Text>
				</TouchableOpacity>
			</Animated.View>
			
			<Animated.View style={[styles.quantityContainer, animatedInputStyle]}>
				<TextInput
					style={[styles.input, compact && styles.smallInput]}
					value={localQuantity.toString()}
					onChangeText={handleQuantityChange}
					keyboardType="numeric"
					selectTextOnFocus
				/>
				<Text style={styles.unitText}>{unit}</Text>
			</Animated.View>
			
			<Animated.View style={animatedIncrementStyle}>
				<TouchableOpacity 
					style={[styles.button, compact && styles.smallButton]}
					onPress={handleIncrement}
				>
					<Text style={styles.buttonText}>+</Text>
				</TouchableOpacity>
			</Animated.View>
			
			{showSaveButton && onSave && (
				<TouchableOpacity 
					style={styles.saveButton}
					onPress={onSave}
				>
					<Text style={styles.saveButtonText}>Save</Text>
				</TouchableOpacity>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	compactContainer: {
		flexWrap: 'nowrap',
	},
	button: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: '#f0f0f0',
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#e0e0e0',
		marginHorizontal: 2,
	},
	smallButton: {
		width: 24,
		height: 24,
		borderRadius: 12,
	},
	buttonText: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#4CAF50',
	},
	quantityContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginHorizontal: 8,
		padding: 4,
		backgroundColor: '#f0f0f0',
		borderRadius: 4,
		borderWidth: 1,
		borderColor: '#e0e0e0',
	},
	input: {
		width: 48,
		fontSize: 16,
		textAlign: 'center',
		paddingVertical: 0,
	},
	smallInput: {
		width: 40,
		fontSize: 14,
	},
	unitText: {
		fontSize: 14,
		color: '#666',
		marginLeft: 4,
	},
	saveButton: {
		backgroundColor: '#4CAF50',
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 4,
		marginLeft: 8,
	},
	saveButtonText: {
		color: 'white',
		fontWeight: '600',
		fontSize: 14,
	},
});

export default QuantityControls; 