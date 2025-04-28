import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import ShoppingItem from '../components/ShoppingItem';
import { useShoppingStore } from '../store/useShoppingStore';

type RootStackParamList = {
	ShoppingList: undefined;
	AllProducts: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

function groupShoppingList(shoppingList: Array<{ id: string; name: string; quantity: number; unit: string; isBought?: boolean; }>) {
	const groups: Record<string, { id: string; name: string; quantity: number; unit: string; isBought: boolean; ids: string[] }> = {};
	for (const item of shoppingList) {
		const key = `${item.name}__${item.unit}`;
		if (!groups[key]) {
			groups[key] = { ...item, quantity: 0, isBought: false, ids: [] };
		}
		groups[key].quantity += item.quantity;
		groups[key].isBought = groups[key].isBought || !!item.isBought;
		groups[key].ids.push(item.id);
	}
	return Object.values(groups);
}

function ShoppingListScreen() {
	const navigation = useNavigation<NavigationProp>();
	const shoppingList = useShoppingStore((state) => state.shoppingList);
	const removeBought = useShoppingStore((state) => state.removeBought);
	const toggleBoughtByNameUnit = useShoppingStore((state) => state.toggleBoughtByNameUnit);

	const groupedShoppingList = useMemo(() => {
		const grouped = groupShoppingList(shoppingList);
		return grouped.sort((a, b) => Number(a.isBought) - Number(b.isBought));
	}, [shoppingList]);

	const inCartCount = groupedShoppingList.filter(item => item.isBought).length;

	function handleRemoveBought() {
		removeBought();
	}

	function handleOpenAllProducts() {
		navigation.navigate('AllProducts');
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Shopping List</Text>
			</View>
			
			{groupedShoppingList.length === 0 ? (
				<View style={styles.emptyContainer}>
					<Text style={styles.emptyText}>Your shopping list is empty</Text>
					<Text style={styles.emptySubtext}>Add products by clicking the + button</Text>
				</View>
			) : (
				<>
					<FlatList
						data={groupedShoppingList}
						keyExtractor={(item, index) => `${item.name}-${item.unit}`}
						renderItem={({ item }: { item: { id: string; name: string; quantity: number; unit: string; isBought: boolean; ids: string[] } }) => (
							<ShoppingItem
								id={item.ids[0]}
								name={item.name}
								quantity={item.quantity}
								unit={item.unit}
								isBought={item.isBought}
								onToggleBought={() => toggleBoughtByNameUnit(item.name, item.unit)}
							/>
						)}
						contentContainerStyle={styles.list}
					/>
					
					{inCartCount > 0 && (
						<TouchableOpacity 
							style={styles.button}
							onPress={handleRemoveBought}
							activeOpacity={0.7}
							accessibilityLabel="Remove items that are in cart"
							accessibilityRole="button"
						>
							<Text style={styles.buttonText}>Remove Items In Cart ({inCartCount})</Text>
						</TouchableOpacity>
					)}
				</>
			)}

			<TouchableOpacity 
				style={styles.fab}
				onPress={handleOpenAllProducts}
				activeOpacity={0.7}
				accessibilityLabel="Add products"
				accessibilityRole="button"
			>
				<MaterialIcons name="add" size={24} color="white" />
			</TouchableOpacity>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	header: {
		padding: 16,
		backgroundColor: '#4CAF50',
		elevation: 4,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: 'white',
		textAlign: 'center',
	},
	list: {
		flexGrow: 1,
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	emptyText: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: 8,
		textAlign: 'center',
	},
	emptySubtext: {
		fontSize: 14,
		color: '#666',
		textAlign: 'center',
	},
	button: {
		margin: 16,
		backgroundColor: '#F44336',
		padding: 16,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
		display: 'flex',
	},
	buttonText: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 16,
	},
	fab: {
		position: 'absolute',
		width: 56,
		height: 56,
		alignItems: 'center',
		justifyContent: 'center',
		right: 20,
		bottom: 90,
		backgroundColor: '#4CAF50',
		borderRadius: 28,
		elevation: 8,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
	},
	fabText: {
		fontSize: 24,
		color: 'white',
		fontWeight: 'bold',
	},
});

export default ShoppingListScreen; 