import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useShoppingStore } from '../store/useShoppingStore';
import Checkbox from './ui/Checkbox';
import Animated, { 
	useSharedValue, 
	useAnimatedStyle, 
	withTiming, 
	withSequence,
	Easing
} from 'react-native-reanimated';
import { getCategoryImage } from '../utils/categoryImages';
import DefaultCategoryImage from './ui/DefaultCategoryImage';

type ShoppingItemProps = {
	id: string;
	name: string;
	quantity: number;
	unit: string;
	isBought?: boolean;
	index?: number;
	onToggleBought?: () => void;
	category?: string;
};

function ShoppingItem({ id, name, quantity, unit, isBought = false, index, onToggleBought, category = 'Other' }: ShoppingItemProps) {
	const itemScale = useSharedValue(1);
	const textOpacity = useSharedValue(1);
	const backgroundOpacity = useSharedValue(0);

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
		if (onToggleBought) {
			onToggleBought();
			return;
		}
		const toggleBought = useShoppingStore((state) => state.toggleBought);
		toggleBought(id, index);
	}

	const categoryImageSource = getCategoryImage(category);

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

				{categoryImageSource && (
					<View style={styles.categoryImageContainer}>
						<Image 
							source={categoryImageSource}
							style={styles.categoryImage}
							resizeMode="contain"
						/>
					</View>
				)}
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
	categoryImageContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#f0f9f0',
		marginLeft: 12,
		padding: 8,
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
	categoryImage: {
		width: '100%',
		height: '100%',
	},
});

export default ShoppingItem; 