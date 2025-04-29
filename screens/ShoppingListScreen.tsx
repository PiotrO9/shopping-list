import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import ShoppingItem from '../components/ShoppingItem';
import { useShoppingStore } from '../store/useShoppingStore';
import GroupingSelector, { GroupingMethod, SortDirection } from '../components/ui/GroupingSelector';
import ProgressBar from '../components/ui/ProgressBar';

type RootStackParamList = {
	ShoppingList: undefined;
	AllProducts: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

function groupShoppingList(shoppingList: Array<{ id: string; name: string; quantity: number; unit: string; isBought?: boolean; category: string; }>) {
	const groups: Record<string, { id: string; name: string; quantity: number; unit: string; isBought: boolean; ids: string[]; category: string }> = {};
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
	const [groupingMethod, setGroupingMethod] = useState<GroupingMethod>('category');
	const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

	const groupedShoppingList = useMemo(() => {
		const grouped = groupShoppingList(shoppingList);
		const sorted = grouped.sort((a, b) => {
			if (a.isBought !== b.isBought) {
				return Number(a.isBought) - Number(b.isBought);
			}
			
			let comparison = 0;
			switch (groupingMethod) {
				case 'category':
					comparison = a.category.localeCompare(b.category);
					break;
				case 'alphabetical':
					comparison = a.name.localeCompare(b.name);
					break;
				case 'quantity':
					comparison = a.quantity - b.quantity;
					break;
			}

			return sortDirection === 'asc' ? comparison : -comparison;
		});

		return sorted;
	}, [shoppingList, groupingMethod, sortDirection]);

	const inCartCount = groupedShoppingList.filter(item => item.isBought).length;
	const totalItems = groupedShoppingList.length;
	const remainingItems = totalItems - inCartCount;
	const progress = totalItems > 0 ? inCartCount / totalItems : 0;

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
					{shoppingList.length > 1 && (
						<GroupingSelector 
							currentGrouping={groupingMethod}
							sortDirection={sortDirection}
							onGroupingChange={(method, direction) => {
								setGroupingMethod(method);
								setSortDirection(direction);
							}}
						/>
					)}
					
					<FlatList
						data={groupedShoppingList}
						keyExtractor={(item) => `${item.name}-${item.unit}`}
						renderItem={({ item }) => (
							<ShoppingItem
								id={item.ids[0]}
								name={item.name}
								quantity={item.quantity}
								unit={item.unit}
								isBought={item.isBought}
								onToggleBought={() => toggleBoughtByNameUnit(item.name, item.unit)}
								category={item.category}
							/>
						)}
						contentContainerStyle={styles.list}
					/>
					
					<View style={styles.cartInfoContainer}>
						<ProgressBar 
							progress={progress}
							color={remainingItems === 0 ? '#4CAF50' : '#2196F3'}
							height={6}
						/>
						<Text style={styles.cartInfoText}>
							{remainingItems > 0 
								? `${remainingItems} item${remainingItems === 1 ? '' : 's'} left to buy`
								: 'All items in cart!'
							}
						</Text>
						{inCartCount > 0 && (
							<TouchableOpacity 
								style={[
									styles.button,
									remainingItems === 0 && styles.buttonComplete
								]}
								onPress={handleRemoveBought}
								activeOpacity={0.7}
								disabled={remainingItems > 0}
								accessibilityLabel={
									remainingItems > 0
										? `${remainingItems} items left to buy`
										: "Complete shopping and clear cart"
								}
								accessibilityRole="button"
								accessibilityState={{ disabled: remainingItems > 0 }}
							>
								<Text style={styles.buttonText}>
									{remainingItems === 0 
										? "Complete Shopping"
										: `Items In Cart (${inCartCount})`
									}
								</Text>
							</TouchableOpacity>
						)}
					</View>
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
	cartInfoContainer: {
		padding: 16,
		backgroundColor: 'white',
		borderTopWidth: 1,
		borderTopColor: '#e0e0e0',
	},
	cartInfoText: {
		fontSize: 16,
		color: '#666',
		marginTop: 12,
		marginBottom: 8,
		textAlign: 'center',
	},
	button: {
		backgroundColor: '#F44336',
		padding: 16,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
		opacity: 0.5,
	},
	buttonComplete: {
		opacity: 1,
		backgroundColor: '#4CAF50',
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
});

export default ShoppingListScreen; 