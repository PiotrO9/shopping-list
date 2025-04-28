import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
	const toggleBought = useShoppingStore((state) => state.toggleBought);
	
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

	return (
		<View style={styles.touchableContainer}>
			<Animated.View style={[styles.container, animatedContainerStyle]}>
				<TouchableOpacity 
					onPress={handleToggleBought}
					activeOpacity={0.7}
					accessibilityLabel={`${name}, ${isBought ? 'in cart' : 'not in cart'}`}
					accessibilityRole="checkbox"
					accessibilityState={{ checked: isBought }}
				>
					<Checkbox checked={isBought} />
				</TouchableOpacity>
				
				<View style={styles.itemInfo}>
					<Animated.Text style={[styles.name, isBought && styles.boughtText, animatedTextStyle]}>
						{name}
					</Animated.Text>
					
					<View style={styles.quantityRow}>
						<View style={styles.quantityWrapper}>
							<Animated.Text style={[styles.details, isBought && styles.boughtText, animatedTextStyle]}>
								{quantity} {unit}
							</Animated.Text>
						</View>
						
						<Animated.Text style={[styles.statusText, isBought && styles.inCartText, animatedTextStyle]}>
							{isBought ? 'In Cart' : 'To Buy'}
						</Animated.Text>
					</View>
				</View>
			</Animated.View>
		</View>
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
});

export default ShoppingItem; 