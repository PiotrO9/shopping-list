import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useShoppingStore } from '../store/useShoppingStore';
import QuantityControls from './ui/QuantityControls';
import Animated, { 
	useSharedValue, 
	useAnimatedStyle, 
	withTiming, 
	withSequence,
	withSpring,
	Easing
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';

type ProductItemProps = {
	id: string;
	name: string;
	quantity: number;
	unit: string;
	isEditing?: boolean;
};

function ProductItem({ 
	id, 
	name, 
	quantity, 
	unit, 
	isEditing: externalIsEditing 
}: ProductItemProps) {
	const [added, setAdded] = useState(false);
	const [selectedQuantity, setSelectedQuantity] = useState(quantity);
	const [internalIsEditing, setInternalIsEditing] = useState(false);
	const [addCount, setAddCount] = useState(0);
	const addToShoppingList = useShoppingStore((state) => state.addToShoppingList);
	const decreaseQuantity = useShoppingStore((state) => state.decreaseQuantity);
	const shoppingList = useShoppingStore((state) => state.shoppingList);
	
	const addButtonScale = useSharedValue(1);
	const addButtonColor = useSharedValue(0);
	const removeButtonScale = useSharedValue(1);
	const itemOpacity = useSharedValue(0);
	const itemTranslateY = useSharedValue(20);
	
	const isEditing = externalIsEditing !== undefined ? externalIsEditing : internalIsEditing;
	
	const itemsInList = useMemo(() => 
		shoppingList.filter(item => item.id === id),
		[shoppingList, id]
	);
	
	const totalQuantityInList = useMemo(() => {
		if (itemsInList.length === 0) return 0;
		return itemsInList.reduce((total, item) => total + item.quantity, 0);
	}, [itemsInList]);
	
	useEffect(() => {
		itemOpacity.value = withTiming(1, { duration: 300 });
		itemTranslateY.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) });
	}, []);
	
	useEffect(() => {
		if (added) {
			addButtonScale.value = withSequence(
				withTiming(0.9, { duration: 100 }),
				withTiming(1.1, { duration: 150 }),
				withTiming(1, { duration: 150 })
			);
			addButtonColor.value = withTiming(1, { duration: 150 });
		} else {
			addButtonColor.value = withTiming(0, { duration: 300 });
		}
	}, [added]);

	function handleAddToShoppingList() {
		addToShoppingList({
			id,
			name,
			quantity: selectedQuantity,
			unit,
		});
		
		setAdded(true);
		setAddCount(prev => prev + 1);
		setTimeout(() => {
			setAdded(false);
		}, 1000);
	}
	
	function handleRemoveFromShoppingList() {
		if (itemsInList.length > 0) {
			removeButtonScale.value = withSequence(
				withTiming(0.8, { duration: 100 }),
				withTiming(1.2, { duration: 150 }),
				withTiming(1, { duration: 200 })
			);
			
			decreaseQuantity(id);
			setAddCount(prev => Math.max(0, prev - 1));
		}
	}

	function handleQuantityChange(newQuantity: number) {
		setSelectedQuantity(newQuantity);
	}
	
	function toggleEditing() {
		if (externalIsEditing === undefined) {
			setInternalIsEditing(!internalIsEditing);
		}
	}

	function formatQuantity(qty: number, unitType: string): string {
		return `${qty} ${unitType}`;
	}
	
	const animatedItemStyle = useAnimatedStyle(() => {
		return {
			opacity: itemOpacity.value,
			transform: [{ translateY: itemTranslateY.value }]
		};
	});
	
	const animatedAddButtonStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: addButtonScale.value }]
		};
	});
	
	const animatedRemoveButtonStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: removeButtonScale.value }]
		};
	});

	return (
		<Animated.View style={[styles.container, animatedItemStyle]}>
			<View style={styles.productInfo}>
				<Text style={styles.name}>{name}</Text>
				<View style={styles.detailsRow}>
					<TouchableOpacity 
						style={styles.quantityDisplay}
						onPress={toggleEditing}
						disabled={externalIsEditing !== undefined}
					>
						{!isEditing ? (
							<Text style={styles.details}>
								{selectedQuantity} {unit}
							</Text>
						) : (
							<QuantityControls
								quantity={selectedQuantity}
								unit={unit}
								onChangeQuantity={handleQuantityChange}
								compact={true}
							/>
						)}
					</TouchableOpacity>
					
					{itemsInList.length > 0 && (
						<Text style={styles.inListIndicator}>
							{formatQuantity(totalQuantityInList, unit)} in list
						</Text>
					)}
				</View>
			</View>
			
			<View style={styles.actionContainer}>
				{itemsInList.length > 0 && (
					<Animated.View style={animatedRemoveButtonStyle}>
						<TouchableOpacity 
							style={styles.actionButtonRemove}
							onPress={handleRemoveFromShoppingList}
							activeOpacity={0.7}
							accessibilityLabel={`Remove one ${name} from shopping list`}
							accessibilityRole="button"
						>
							<Text style={styles.actionButtonText}>
								<MaterialIcons name="remove" size={16} color="white" />
							</Text>
						</TouchableOpacity>
					</Animated.View>
				)}
				
				<Animated.View style={animatedAddButtonStyle}>
					<TouchableOpacity 
						style={styles.actionButtonAdd}
						onPress={handleAddToShoppingList}
						activeOpacity={0.7}
						accessibilityLabel={`Add ${name} to shopping list`}
						accessibilityRole="button"
					>
						<Text style={styles.actionButtonText}>
							<MaterialIcons name="add" size={16} color="white" />
						</Text>
					</TouchableOpacity>
				</Animated.View>
			</View>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#e0e0e0',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: 'white',
	},
	productInfo: {
		flex: 1,
	},
	name: {
		fontSize: 16,
		fontWeight: '600',
		marginBottom: 4,
	},
	detailsRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	quantityDisplay: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	details: {
		fontSize: 14,
		color: '#666',
		marginRight: 8,
	},
	inListIndicator: {
		fontSize: 12,
		color: '#4CAF50',
		fontWeight: '500',
		marginLeft: 8,
	},
	actionContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	actionButtonAdd: {
		backgroundColor: '#4CAF50',
		width: 32,
		height: 32,
		borderRadius: 16,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	actionButtonRemove: {
		backgroundColor: '#F44336',
		width: 32,
		height: 32,
		borderRadius: 16,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 8,
	},
	actionButtonText: {
		color: 'white',
		fontWeight: 'bold',
		height: 16,
	},
});

export default ProductItem; 