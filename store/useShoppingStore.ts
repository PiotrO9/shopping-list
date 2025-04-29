import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Product = {
	id: string;
	name: string;
	quantity: number;
	unit: string;
	isBought?: boolean;
	category: string;
};

type ShoppingStore = {
	shoppingList: Product[];
	isInitialized: boolean;
	addToShoppingList: (product: Product) => void;
	toggleBought: (id: string, index?: number) => void;
	removeBought: () => void;
	updateQuantity: (id: string, index: number, newQuantity: number) => void;
	removeFromShoppingList: (id: string, index?: number) => void;
	toggleBoughtByNameUnit: (name: string, unit: string) => void;
	decreaseQuantity: (id: string) => void;
	initializeStore: () => Promise<void>;
};

// Storage keys
const STORAGE_KEY = '@shopping_list_store';

// Helper function to persist state to AsyncStorage
const saveToStorage = async (shoppingList: Product[]) => {
	try {
		await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(shoppingList));
	} catch (error) {
		console.error('Error saving shopping list to storage:', error);
	}
};

export const useShoppingStore = create<ShoppingStore>((set, get) => ({
	shoppingList: [],
	isInitialized: false,
	
	initializeStore: async () => {
		try {
			const storedData = await AsyncStorage.getItem(STORAGE_KEY);
			if (storedData) {
				const parsedData = JSON.parse(storedData);
				set({ shoppingList: parsedData, isInitialized: true });
			} else {
				set({ isInitialized: true });
			}
		} catch (error) {
			console.error('Error loading shopping list from storage:', error);
			set({ isInitialized: true });
		}
	},
	
	addToShoppingList: (product: Product) => {
		set((state) => {
			const existingItemIndex = state.shoppingList.findIndex(
				item => item.name === product.name && item.unit === product.unit
			);

			let updatedList;
			if (existingItemIndex !== -1) {
				updatedList = [...state.shoppingList];
				updatedList[existingItemIndex] = {
					...updatedList[existingItemIndex],
					quantity: updatedList[existingItemIndex].quantity + product.quantity
				};
			} else {
				updatedList = [...state.shoppingList, { ...product, isBought: false }];
			}
			
			// Persist to storage
			saveToStorage(updatedList);
			
			return { shoppingList: updatedList };
		});
	},
	
	toggleBought: (id: string, index?: number) => {
		set((state) => {
			const updatedList = state.shoppingList.map((item, idx) => {
				if (index !== undefined) {
					return idx === index ? { ...item, isBought: !item.isBought } : item;
				}
				return item.id === id ? { ...item, isBought: !item.isBought } : item;
			});
			
			// Persist to storage
			saveToStorage(updatedList);
			
			return { shoppingList: updatedList };
		});
	},
	
	removeBought: () => {
		set((state) => {
			const updatedList = state.shoppingList.filter((item) => !item.isBought);
			
			// Persist to storage
			saveToStorage(updatedList);
			
			return { shoppingList: updatedList };
		});
	},
	
	updateQuantity: (id: string, index: number, newQuantity: number) => {
		set((state) => {
			const updatedList = state.shoppingList.map((item, idx) => {
				if (idx === index && item.id === id) {
					return { ...item, quantity: newQuantity };
				}
				return item;
			});
			
			// Persist to storage
			saveToStorage(updatedList);
			
			return { shoppingList: updatedList };
		});
	},
	
	removeFromShoppingList: (id: string, index?: number) => {
		set((state) => {
			let updatedList;
			
			if (index !== undefined) {
				updatedList = state.shoppingList.filter((_, idx) => idx !== index);
			} else {
				const items = state.shoppingList.filter(item => item.id === id);
				if (items.length === 0) return { shoppingList: state.shoppingList };
				
				const lastIndex = state.shoppingList.lastIndexOf(items[items.length - 1]);
				updatedList = state.shoppingList.filter((_, idx) => idx !== lastIndex);
			}
			
			// Persist to storage
			saveToStorage(updatedList);
			
			return { shoppingList: updatedList };
		});
	},
	
	toggleBoughtByNameUnit: (name: string, unit: string) => {
		set((state) => {
			const groupIsBought = state.shoppingList
				.filter(item => item.name === name && item.unit === unit)
				.some(item => item.isBought);

			const updatedList = state.shoppingList.map(item =>
				item.name === name && item.unit === unit
					? { ...item, isBought: !groupIsBought }
					: item
			);
			
			// Persist to storage
			saveToStorage(updatedList);
			
			return { shoppingList: updatedList };
		});
	},
	
	decreaseQuantity: (id: string) => {
		set((state) => {
			const items = state.shoppingList.filter(item => item.id === id);
			if (items.length === 0) return { shoppingList: state.shoppingList };
			
			const lastIndex = state.shoppingList.lastIndexOf(items[items.length - 1]);
			const item = state.shoppingList[lastIndex];
			
			const baseProduct = sampleProducts.find(p => p.id === id);
			if (!baseProduct) return { shoppingList: state.shoppingList };
			
			const decreaseAmount = baseProduct.quantity;
			
			let updatedList;
			if (item.quantity <= decreaseAmount) {
				updatedList = state.shoppingList.filter((_, idx) => idx !== lastIndex);
			} else {
				updatedList = state.shoppingList.map((item, idx) => 
					idx === lastIndex ? { ...item, quantity: item.quantity - decreaseAmount } : item
				);
			}
			
			// Persist to storage
			saveToStorage(updatedList);
			
			return { shoppingList: updatedList };
		});
	},
}));

export const sampleProducts: Product[] = [
	{ id: '1', name: 'Milk', quantity: 1, unit: 'l', category: 'Dairy' },
	{ id: '2', name: 'Eggs', quantity: 12, unit: 'pcs', category: 'Dairy' },
	{ id: '3', name: 'Butter', quantity: 250, unit: 'g', category: 'Dairy' },
	{ id: '4', name: 'Cheese (Cheddar)', quantity: 200, unit: 'g', category: 'Dairy' },
	{ id: '5', name: 'Yogurt', quantity: 500, unit: 'g', category: 'Dairy' },
	{ id: '6', name: 'Cream', quantity: 200, unit: 'ml', category: 'Dairy' },
	{ id: '7', name: 'Cottage Cheese', quantity: 250, unit: 'g', category: 'Dairy' },
	{ id: '8', name: 'Sour Cream', quantity: 200, unit: 'ml', category: 'Dairy' },
	{ id: '9', name: 'Bread', quantity: 1, unit: 'loaf', category: 'Bread & Bakery' },
	{ id: '10', name: 'Bagels', quantity: 6, unit: 'pcs', category: 'Bread & Bakery' },
	{ id: '11', name: 'Tortillas', quantity: 8, unit: 'pcs', category: 'Bread & Bakery' },
	{ id: '12', name: 'Croissants', quantity: 4, unit: 'pcs', category: 'Bread & Bakery' },
	{ id: '13', name: 'Hamburger Buns', quantity: 6, unit: 'pcs', category: 'Bread & Bakery' },
	{ id: '14', name: 'Hot Dog Buns', quantity: 8, unit: 'pcs', category: 'Bread & Bakery' },
	{ id: '15', name: 'Muffins', quantity: 6, unit: 'pcs', category: 'Bread & Bakery' },
	{ id: '16', name: 'Pita Bread', quantity: 6, unit: 'pcs', category: 'Bread & Bakery' },
	{ id: '17', name: 'Apples', quantity: 6, unit: 'pcs', category: 'Fruits' },
	{ id: '18', name: 'Bananas', quantity: 1, unit: 'bunch', category: 'Fruits' },
	{ id: '19', name: 'Oranges', quantity: 6, unit: 'pcs', category: 'Fruits' },
	{ id: '20', name: 'Strawberries', quantity: 250, unit: 'g', category: 'Fruits' },
	{ id: '21', name: 'Grapes', quantity: 500, unit: 'g', category: 'Fruits' },
	{ id: '22', name: 'Blueberries', quantity: 125, unit: 'g', category: 'Fruits' },
	{ id: '23', name: 'Lemons', quantity: 3, unit: 'pcs', category: 'Fruits' },
	{ id: '24', name: 'Avocados', quantity: 2, unit: 'pcs', category: 'Fruits' },
	{ id: '25', name: 'Pears', quantity: 4, unit: 'pcs', category: 'Fruits' },
	{ id: '26', name: 'Watermelon', quantity: 1, unit: 'pc', category: 'Fruits' },
	{ id: '27', name: 'Tomatoes', quantity: 4, unit: 'pcs', category: 'Vegetables' },
	{ id: '28', name: 'Potatoes', quantity: 1, unit: 'kg', category: 'Vegetables' },
	{ id: '29', name: 'Onions', quantity: 3, unit: 'pcs', category: 'Vegetables' },
	{ id: '30', name: 'Garlic', quantity: 1, unit: 'bulb', category: 'Vegetables' },
	{ id: '31', name: 'Lettuce', quantity: 1, unit: 'head', category: 'Vegetables' },
	{ id: '32', name: 'Carrots', quantity: 500, unit: 'g', category: 'Vegetables' },
	{ id: '33', name: 'Bell Peppers', quantity: 3, unit: 'pcs', category: 'Vegetables' },
	{ id: '34', name: 'Cucumbers', quantity: 2, unit: 'pcs', category: 'Vegetables' },
	{ id: '35', name: 'Broccoli', quantity: 1, unit: 'head', category: 'Vegetables' },
	{ id: '36', name: 'Spinach', quantity: 200, unit: 'g', category: 'Vegetables' },
	{ id: '37', name: 'Mushrooms', quantity: 250, unit: 'g', category: 'Vegetables' },
	{ id: '38', name: 'Zucchini', quantity: 2, unit: 'pcs', category: 'Vegetables' },
	{ id: '39', name: 'Chicken Breast', quantity: 500, unit: 'g', category: 'Meat & Seafood' },
	{ id: '40', name: 'Ground Beef', quantity: 500, unit: 'g', category: 'Meat & Seafood' },
	{ id: '41', name: 'Salmon Fillet', quantity: 300, unit: 'g', category: 'Meat & Seafood' },
	{ id: '42', name: 'Bacon', quantity: 200, unit: 'g', category: 'Meat & Seafood' },
	{ id: '43', name: 'Sausages', quantity: 6, unit: 'pcs', category: 'Meat & Seafood' },
	{ id: '44', name: 'Pork Chops', quantity: 4, unit: 'pcs', category: 'Meat & Seafood' },
	{ id: '45', name: 'Shrimp', quantity: 250, unit: 'g', category: 'Meat & Seafood' },
	{ id: '46', name: 'Turkey', quantity: 500, unit: 'g', category: 'Meat & Seafood' },
	{ id: '47', name: 'Ham', quantity: 200, unit: 'g', category: 'Meat & Seafood' },
	{ id: '48', name: 'Rice', quantity: 1, unit: 'kg', category: 'Pantry Items' },
	{ id: '49', name: 'Pasta', quantity: 500, unit: 'g', category: 'Pantry Items' },
	{ id: '50', name: 'Flour', quantity: 1, unit: 'kg', category: 'Pantry Items' },
	{ id: '51', name: 'Sugar', quantity: 1, unit: 'kg', category: 'Pantry Items' },
	{ id: '52', name: 'Salt', quantity: 500, unit: 'g', category: 'Pantry Items' },
	{ id: '53', name: 'Black Pepper', quantity: 100, unit: 'g', category: 'Pantry Items' },
	{ id: '54', name: 'Olive Oil', quantity: 500, unit: 'ml', category: 'Pantry Items' },
	{ id: '55', name: 'Vegetable Oil', quantity: 1, unit: 'l', category: 'Pantry Items' },
	{ id: '56', name: 'Vinegar', quantity: 250, unit: 'ml', category: 'Pantry Items' },
	{ id: '57', name: 'Honey', quantity: 250, unit: 'g', category: 'Pantry Items' },
	{ id: '58', name: 'Peanut Butter', quantity: 350, unit: 'g', category: 'Pantry Items' },
	{ id: '59', name: 'Jam', quantity: 300, unit: 'g', category: 'Pantry Items' },
	{ id: '60', name: 'Cereal', quantity: 500, unit: 'g', category: 'Pantry Items' },
	{ id: '61', name: 'Oats', quantity: 500, unit: 'g', category: 'Pantry Items' },
	{ id: '62', name: 'Canned Tuna', quantity: 160, unit: 'g', category: 'Canned Goods' },
	{ id: '63', name: 'Canned Beans', quantity: 400, unit: 'g', category: 'Canned Goods' },
	{ id: '64', name: 'Canned Tomatoes', quantity: 400, unit: 'g', category: 'Canned Goods' },
	{ id: '65', name: 'Canned Corn', quantity: 300, unit: 'g', category: 'Canned Goods' },
	{ id: '66', name: 'Tomato Sauce', quantity: 500, unit: 'g', category: 'Canned Goods' },
	{ id: '67', name: 'Soup', quantity: 400, unit: 'ml', category: 'Canned Goods' },
	{ id: '68', name: 'Frozen Peas', quantity: 500, unit: 'g', category: 'Frozen Foods' },
	{ id: '69', name: 'Frozen Berries', quantity: 400, unit: 'g', category: 'Frozen Foods' },
	{ id: '70', name: 'Frozen Pizza', quantity: 1, unit: 'pc', category: 'Frozen Foods' },
	{ id: '71', name: 'Ice Cream', quantity: 1, unit: 'l', category: 'Frozen Foods' },
	{ id: '72', name: 'Frozen Vegetables Mix', quantity: 500, unit: 'g', category: 'Frozen Foods' },
	{ id: '73', name: 'Coffee', quantity: 250, unit: 'g', category: 'Beverages' },
	{ id: '74', name: 'Tea', quantity: 50, unit: 'bags', category: 'Beverages' },
	{ id: '75', name: 'Orange Juice', quantity: 1, unit: 'l', category: 'Beverages' },
	{ id: '76', name: 'Soda', quantity: 2, unit: 'l', category: 'Beverages' },
	{ id: '77', name: 'Water', quantity: 6, unit: 'bottles', category: 'Beverages' },
	{ id: '78', name: 'Beer', quantity: 6, unit: 'bottles', category: 'Beverages' },
	{ id: '79', name: 'Wine', quantity: 1, unit: 'bottle', category: 'Beverages' },
	{ id: '80', name: 'Potato Chips', quantity: 200, unit: 'g', category: 'Snacks' },
	{ id: '81', name: 'Pretzels', quantity: 300, unit: 'g', category: 'Snacks' },
	{ id: '82', name: 'Nuts', quantity: 200, unit: 'g', category: 'Snacks' },
	{ id: '83', name: 'Chocolate', quantity: 100, unit: 'g', category: 'Snacks' },
	{ id: '84', name: 'Cookies', quantity: 300, unit: 'g', category: 'Snacks' },
	{ id: '85', name: 'Popcorn', quantity: 100, unit: 'g', category: 'Snacks' },
	{ id: '86', name: 'Ketchup', quantity: 500, unit: 'ml', category: 'Condiments' },
	{ id: '87', name: 'Mustard', quantity: 200, unit: 'ml', category: 'Condiments' },
	{ id: '88', name: 'Mayonnaise', quantity: 400, unit: 'ml', category: 'Condiments' },
	{ id: '89', name: 'Soy Sauce', quantity: 250, unit: 'ml', category: 'Condiments' },
	{ id: '90', name: 'Hot Sauce', quantity: 150, unit: 'ml', category: 'Condiments' },
	{ id: '91', name: 'BBQ Sauce', quantity: 400, unit: 'ml', category: 'Condiments' },
	{ id: '92', name: 'Salad Dressing', quantity: 250, unit: 'ml', category: 'Condiments' },
	{ id: '93', name: 'Baking Powder', quantity: 150, unit: 'g', category: 'Baking' },
	{ id: '94', name: 'Baking Soda', quantity: 200, unit: 'g', category: 'Baking' },
	{ id: '95', name: 'Vanilla Extract', quantity: 50, unit: 'ml', category: 'Baking' },
	{ id: '96', name: 'Cocoa Powder', quantity: 200, unit: 'g', category: 'Baking' },
	{ id: '97', name: 'Chocolate Chips', quantity: 300, unit: 'g', category: 'Baking' },
	{ id: '98', name: 'Yeast', quantity: 10, unit: 'g', category: 'Baking' },
	{ id: '99', name: 'Almond Milk', quantity: 1, unit: 'l', category: 'Dairy Alternatives' },
	{ id: '100', name: 'Tofu', quantity: 400, unit: 'g', category: 'Dairy Alternatives' },
	{ id: '101', name: 'Oat Milk', quantity: 1, unit: 'l', category: 'Dairy Alternatives' },
	{ id: '102', name: 'Coconut Milk', quantity: 400, unit: 'ml', category: 'Dairy Alternatives' },
]; 