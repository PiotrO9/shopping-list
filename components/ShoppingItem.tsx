import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useShoppingStore } from '../store/useShoppingStore';

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
			style={[styles.container, isBought && styles.boughtContainer]}
			onPress={handleToggleBought}
			activeOpacity={0.7}
			accessibilityLabel={`${name}, ${isBought ? 'in cart' : 'not in cart'}`}
			accessibilityRole="checkbox"
			accessibilityState={{ checked: isBought }}
		>
			<View style={[styles.checkbox, isBought && styles.checkedBox]}>
				{isBought && <View style={styles.checkmark} />}
			</View>
			
			<View style={styles.itemInfo}>
				<Text style={[styles.name, isBought && styles.boughtText]}>{name}</Text>
				
				<View style={styles.quantityRow}>
					{isEditing ? (
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
					) : (
						<TouchableOpacity onPress={handleStartEditing} style={styles.quantityWrapper}>
							<Text style={[styles.details, isBought && styles.boughtText]}>
								{quantity} {unit}
							</Text>
							<Text style={styles.editHint}>(edit)</Text>
						</TouchableOpacity>
					)}
					
					<Text style={[styles.statusText, isBought && styles.inCartText]}>
						{isBought ? 'In Cart' : 'To Buy'}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#e0e0e0',
		alignItems: 'center',
		backgroundColor: 'white',
	},
	boughtContainer: {
		backgroundColor: '#f0f9f0',
	},
	checkbox: {
		width: 24,
		height: 24,
		borderRadius: 12,
		borderWidth: 2,
		borderColor: '#4CAF50',
		marginRight: 16,
		justifyContent: 'center',
		alignItems: 'center',
	},
	checkedBox: {
		backgroundColor: '#4CAF50',
	},
	checkmark: {
		width: 12,
		height: 6,
		borderLeftWidth: 2,
		borderBottomWidth: 2,
		borderColor: 'white',
		transform: [{ rotate: '-45deg' }],
	},
	itemInfo: {
		flex: 1,
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
		marginLeft: 4,
	},
	saveButtonText: {
		color: 'white',
		fontWeight: '600',
		fontSize: 12,
	},
});

export default ShoppingItem; 