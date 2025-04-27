import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useShoppingStore } from '../store/useShoppingStore';
import Checkbox from './ui/Checkbox';
import Animated, { 
	useSharedValue, 
	useAnimatedStyle, 
	withTiming, 
	withSequence,
	withDelay,
	Easing
} from 'react-native-reanimated';

type ShoppingItemProps = {
	id: string;
	name: string;
	quantity: number;
	unit: string;
	isBought?: boolean;
	index: number;
};

function ShoppingItem({ id, name, quantity, unit, isBought = false, index }: ShoppingItemProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [editedQuantity, setEditedQuantity] = useState(quantity);
	const toggleBought = useShoppingStore((state) => state.toggleBought);
	const updateQuantity = useShoppingStore((state) => state.updateQuantity);
	
	// Animation values
	const itemScale = useSharedValue(1);
	const textOpacity = useSharedValue(1);
	const backgroundOpacity = useSharedValue(0);

	// Update animations when item is marked as bought/unbought
	React.useEffect(() => {
		if (isBought) {
			itemScale.value = withSequence(
				withTiming(0.95, { duration: 100 }),
				withTiming(1, { duration: 300, easing: Easing.elastic(1.2) })
			);
			textOpacity.value = withTiming(0.6, { duration: 300 });
			backgroundOpacity.value = withTiming(1, { duration: 300 });
		} else {
			itemScale.value = withSequence(
				withTiming(1.02, { duration: 100 }),
				withTiming(1, { duration: 300, easing: Easing.elastic(1.2) })
			);
			textOpacity.value = withTiming(1, { duration: 300 });
			backgroundOpacity.value = withTiming(0, { duration: 300 });
		}
	}, [isBought]);

	const animatedContainerStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: itemScale.value }],
			backgroundColor: backgroundOpacity.value === 0 ? 'white' : '#f0f9f0'
		};
	});

	const animatedTextStyle = useAnimatedStyle(() => {
		return {
			opacity: textOpacity.value
		};
	});

	function handleToggleBought() {
		toggleBought(id, index);
	}

	function handleQuantityChange(text: string) {
		const newValue = parseFloat(text);
		if (!isNaN(newValue) && newValue > 0) {
			setEditedQuantity(newValue);
		}
	}

	function handleStartEditing() {
		setIsEditing(true);
	}

	function handleSaveQuantity() {
		updateQuantity(id, index, editedQuantity);
		setIsEditing(false);
	}

	function handleIncrement() {
		let increment = 1;
		
		if (unit === 'g' || unit === 'ml') {
			if (editedQuantity >= 1000) increment = 500;
			else if (editedQuantity >= 500) increment = 100;
			else if (editedQuantity >= 100) increment = 50;
			else increment = 25;
		} else if (unit === 'kg' || unit === 'l') {
			if (editedQuantity >= 5) increment = 1;
			else if (editedQuantity >= 2) increment = 0.5;
			else increment = 0.25;
		} else if (unit === 'pcs' || unit === 'bottles' || unit === 'bags') {
			increment = 1;
		}
		
		setEditedQuantity(prev => parseFloat((prev + increment).toFixed(2)));
	}

	function handleDecrement() {
		let decrement = 1;
		
		if (unit === 'g' || unit === 'ml') {
			if (editedQuantity > 1000) decrement = 500;
			else if (editedQuantity > 500) decrement = 100;
			else if (editedQuantity > 100) decrement = 50;
			else decrement = 25;
		} else if (unit === 'kg' || unit === 'l') {
			if (editedQuantity > 5) decrement = 1;
			else if (editedQuantity > 2) decrement = 0.5;
			else decrement = 0.25;
		} else if (unit === 'pcs' || unit === 'bottles' || unit === 'bags') {
			decrement = 1;
		}
		
		const newValue = parseFloat((editedQuantity - decrement).toFixed(2));
		setEditedQuantity(newValue > 0 ? newValue : quantity);
	}

	return (
		<TouchableOpacity 
			style={styles.touchableContainer}
			onPress={handleToggleBought}
			activeOpacity={0.7}
			accessibilityLabel={`${name}, ${isBought ? 'in cart' : 'not in cart'}`}
			accessibilityRole="checkbox"
			accessibilityState={{ checked: isBought }}
		>
			<Animated.View style={[styles.container, animatedContainerStyle]}>
				<Checkbox checked={isBought} />
				
				<View style={styles.itemInfo}>
					<Animated.Text style={[styles.name, isBought && styles.boughtText, animatedTextStyle]}>
						{name}
					</Animated.Text>
					
					<View style={styles.quantityRow}>
						<View style={styles.quantityWrapper}>
							<TouchableOpacity onPress={handleStartEditing} disabled={isEditing}>
								<View style={styles.quantityWrapper}>
									{!isEditing ? (
										<>
											<Animated.Text style={[styles.details, isBought && styles.boughtText, animatedTextStyle]}>
												{quantity} {unit}
											</Animated.Text>
											<Text style={styles.editHint}>(tap to edit)</Text>
										</>
									) : (
										<View style={styles.quantityControls}>
											<TouchableOpacity 
												style={styles.smallButton}
												onPress={handleDecrement}
												disabled={editedQuantity <= 0.25}
											>
												<Text style={styles.smallButtonText}>−</Text>
											</TouchableOpacity>
											
											<TextInput
												style={styles.quantityInput}
												value={editedQuantity.toString()}
												onChangeText={handleQuantityChange}
												keyboardType="numeric"
												selectTextOnFocus
												onBlur={handleSaveQuantity}
												autoFocus
											/>
											
											<Text style={styles.unitText}>{unit}</Text>
											
											<TouchableOpacity 
												style={styles.smallButton}
												onPress={handleIncrement}
											>
												<Text style={styles.smallButtonText}>+</Text>
											</TouchableOpacity>
											
											<TouchableOpacity 
												style={styles.saveButton}
												onPress={handleSaveQuantity}
											>
												<Text style={styles.saveButtonText}>Save</Text>
											</TouchableOpacity>
										</View>
									)}
								</View>
							</TouchableOpacity>
						</View>
						
						<Animated.Text style={[styles.statusText, isBought && styles.inCartText, animatedTextStyle]}>
							{isBought ? 'In Cart' : 'To Buy'}
						</Animated.Text>
					</View>
				</View>
			</Animated.View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	touchableContainer: {
		overflow: 'hidden',
	},
	container: {
		flexDirection: 'row',
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#e0e0e0',
		alignItems: 'center',
	},
	itemInfo: {
		flex: 1,
		marginLeft: 16,
	},
	name: {
		fontSize: 16,
		fontWeight: '600',
		marginBottom: 4,
	},
	quantityRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	quantityWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	details: {
		fontSize: 14,
		color: '#666',
	},
	boughtText: {
		color: '#4CAF50',
	},
	statusText: {
		fontSize: 12,
		fontWeight: '500',
		color: '#757575',
		marginLeft: 8,
	},
	inCartText: {
		color: '#4CAF50',
	},
	editHint: {
		fontSize: 12,
		fontStyle: 'italic',
		color: '#aaa',
		marginLeft: 4,
	},
	quantityControls: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	smallButton: {
		width: 24,
		height: 24,
		borderRadius: 12,
		backgroundColor: '#f0f0f0',
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#e0e0e0',
		marginHorizontal: 2,
	},
	smallButtonText: {
		fontSize: 14,
		fontWeight: 'bold',
		color: '#4CAF50',
	},
	quantityInput: {
		width: 40,
		fontSize: 14,
		textAlign: 'center',
		backgroundColor: '#f0f0f0',
		borderRadius: 4,
		marginHorizontal: 2,
		paddingVertical: 0,
	},
	unitText: {
		fontSize: 14,
		color: '#666',
		marginLeft: 4,
		marginRight: 4,
	},
	saveButton: {
		backgroundColor: '#4CAF50',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 4,
		marginLeft: 8,
	},
	saveButtonText: {
		color: 'white',
		fontSize: 12,
		fontWeight: '600',
	},
});

export default ShoppingItem; 