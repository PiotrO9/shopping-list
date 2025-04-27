import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useShoppingStore } from '../store/useShoppingStore';
import QuantityControls from './ui/QuantityControls';

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
	const removeFromShoppingList = useShoppingStore((state) => state.removeFromShoppingList);
	const shoppingList = useShoppingStore((state) => state.shoppingList);
	
	// Use external isEditing state if provided, otherwise use internal state
	const isEditing = externalIsEditing !== undefined ? externalIsEditing : internalIsEditing;
	
	// Get items of this product in the shopping list
	const itemsInList = useMemo(() => 
		shoppingList.filter(item => item.id === id),
		[shoppingList, id]
	);
	
	// Calculate total quantity in list
	const totalQuantityInList = useMemo(() => {
		if (itemsInList.length === 0) return 0;
		return itemsInList.reduce((total, item) => total + item.quantity, 0);
	}, [itemsInList]);

	useEffect(() => {
		setSelectedQuantity(quantity);
	}, [quantity]);

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
			removeFromShoppingList(id);
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

	// Format the quantity with the unit
	function formatQuantity(qty: number, unitType: string): string {
		return `${qty} ${unitType}`;
	}

	return (
		<View style={styles.container}>
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
					<TouchableOpacity 
						style={styles.actionButton}
						onPress={handleRemoveFromShoppingList}
						activeOpacity={0.7}
						accessibilityLabel={`Remove one ${name} from shopping list`}
						accessibilityRole="button"
					>
						<Text style={styles.actionButtonText}>−</Text>
					</TouchableOpacity>
				)}
				
				<TouchableOpacity 
					style={[styles.button, added && styles.addedButton]}
					onPress={handleAddToShoppingList}
					activeOpacity={0.7}
					accessibilityLabel={`Add ${name} to shopping list`}
					accessibilityRole="button"
				>
					<Text style={styles.buttonText}>{added ? 'Added' : 'Add'}</Text>
				</TouchableOpacity>
			</View>
		</View>
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
	button: {
		backgroundColor: '#4CAF50',
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 4,
		marginLeft: 8,
	},
	addedButton: {
		backgroundColor: '#8BC34A',
	},
	buttonText: {
		color: 'white',
		fontWeight: '600',
	},
	actionButton: {
		width: 30,
		height: 30,
		borderRadius: 15,
		backgroundColor: '#F44336',
		justifyContent: 'center',
		alignItems: 'center',
	},
	actionButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
});

export default ProductItem; 