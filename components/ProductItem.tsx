import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useShoppingStore } from '../store/useShoppingStore';

type ProductItemProps = {
	id: string;
	name: string;
	quantity: number;
	unit: string;
};

function ProductItem({ id, name, quantity, unit }: ProductItemProps) {
	const [added, setAdded] = useState(false);
	const [selectedQuantity, setSelectedQuantity] = useState(quantity);
	const [isEditing, setIsEditing] = useState(false);
	const addToShoppingList = useShoppingStore((state) => state.addToShoppingList);
	const shoppingList = useShoppingStore((state) => state.shoppingList);
	
	const countInList = shoppingList.filter(item => item.id === id).length;

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
		setTimeout(() => {
			setAdded(false);
		}, 1000);
	}

	function handleIncrement() {
		let increment = 1;
		
		if (unit === 'g' || unit === 'ml') {
			if (selectedQuantity >= 1000) increment = 500;
			else if (selectedQuantity >= 500) increment = 100;
			else if (selectedQuantity >= 100) increment = 50;
			else increment = 25;
		} else if (unit === 'kg' || unit === 'l') {
			if (selectedQuantity >= 5) increment = 1;
			else if (selectedQuantity >= 2) increment = 0.5;
			else increment = 0.25;
		} else if (unit === 'pcs' || unit === 'bottles' || unit === 'bags') {
			increment = 1;
		}
		
		setSelectedQuantity(prev => parseFloat((prev + increment).toFixed(2)));
	}

	function handleDecrement() {
		let decrement = 1;
		
		if (unit === 'g' || unit === 'ml') {
			if (selectedQuantity > 1000) decrement = 500;
			else if (selectedQuantity > 500) decrement = 100;
			else if (selectedQuantity > 100) decrement = 50;
			else decrement = 25;
		} else if (unit === 'kg' || unit === 'l') {
			if (selectedQuantity > 5) decrement = 1;
			else if (selectedQuantity > 2) decrement = 0.5;
			else decrement = 0.25;
		} else if (unit === 'pcs' || unit === 'bottles' || unit === 'bags') {
			decrement = 1;
		}
		
		const newValue = parseFloat((selectedQuantity - decrement).toFixed(2));
		setSelectedQuantity(newValue > 0 ? newValue : quantity);
	}

	function handleQuantityChange(text: string) {
		const newValue = parseFloat(text);
		if (!isNaN(newValue) && newValue > 0) {
			setSelectedQuantity(newValue);
		}
	}

	return (
		<View style={styles.container}>
			<View style={styles.productInfo}>
				<Text style={styles.name}>{name}</Text>
				<View style={styles.detailsRow}>
					<TouchableOpacity 
						style={styles.quantityDisplay}
						onPress={() => setIsEditing(!isEditing)}
					>
						<Text style={styles.details}>
							{selectedQuantity} {unit}
						</Text>
						{isEditing && (
							<View style={styles.quantityControls}>
								<TouchableOpacity 
									style={styles.smallButton}
									onPress={handleDecrement}
									disabled={selectedQuantity <= 0.25}
								>
									<Text style={styles.smallButtonText}>−</Text>
								</TouchableOpacity>
								<TextInput
									style={styles.quantityInput}
									value={selectedQuantity.toString()}
									onChangeText={handleQuantityChange}
									keyboardType="numeric"
									selectTextOnFocus
								/>
								<TouchableOpacity 
									style={styles.smallButton}
									onPress={handleIncrement}
								>
									<Text style={styles.smallButtonText}>+</Text>
								</TouchableOpacity>
							</View>
						)}
					</TouchableOpacity>
					
					{countInList > 0 && (
						<Text style={styles.inListIndicator}>
							{countInList} in list
						</Text>
					)}
				</View>
			</View>
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
	},
	quantityControls: {
		flexDirection: 'row',
		alignItems: 'center',
		marginLeft: 4,
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
});

export default ProductItem; 