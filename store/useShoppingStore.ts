import { create } from 'zustand';

type Product = {
	id: string;
	name: string;
	quantity: number;
	unit: string;
	isBought?: boolean;
};

type ShoppingStore = {
	shoppingList: Product[];
	addToShoppingList: (product: Product) => void;
	toggleBought: (id: string, index?: number) => void;
	removeBought: () => void;
	updateQuantity: (id: string, index: number, newQuantity: number) => void;
	removeFromShoppingList: (id: string, index?: number) => void;
	toggleBoughtByNameUnit: (name: string, unit: string) => void;
	decreaseQuantity: (id: string) => void;
};

export const useShoppingStore = create<ShoppingStore>((set) => ({
	shoppingList: [],
	
	addToShoppingList: (product: Product) => {
		set((state) => {
			const existingItemIndex = state.shoppingList.findIndex(
				item => item.name === product.name && item.unit === product.unit
			);

			if (existingItemIndex !== -1) {
				const updatedList = [...state.shoppingList];
				updatedList[existingItemIndex] = {
					...updatedList[existingItemIndex],
					quantity: updatedList[existingItemIndex].quantity + product.quantity
				};
				return { shoppingList: updatedList };
			} else {
				return {
					shoppingList: [...state.shoppingList, { ...product, isBought: false }],
				};
			}
		});
	},
	
	toggleBought: (id: string, index?: number) => {
		set((state) => ({
			shoppingList: state.shoppingList.map((item, idx) => {
				if (index !== undefined) {
					return idx === index ? { ...item, isBought: !item.isBought } : item;
				}
				return item.id === id ? { ...item, isBought: !item.isBought } : item;
			}),
		}));
	},
	
	removeBought: () => {
		set((state) => ({
			shoppingList: state.shoppingList.filter((item) => !item.isBought),
		}));
	},
	
	updateQuantity: (id: string, index: number, newQuantity: number) => {
		set((state) => ({
			shoppingList: state.shoppingList.map((item, idx) => {
				if (idx === index && item.id === id) {
					return { ...item, quantity: newQuantity };
				}
				return item;
			}),
		}));
	},
	
	removeFromShoppingList: (id: string, index?: number) => {
		set((state) => {
			if (index !== undefined) {
				return {
					shoppingList: state.shoppingList.filter((_, idx) => idx !== index),
				};
			} else {
				const items = state.shoppingList.filter(item => item.id === id);
				if (items.length === 0) return { shoppingList: state.shoppingList };
				
				const lastIndex = state.shoppingList.lastIndexOf(items[items.length - 1]);
				return {
					shoppingList: state.shoppingList.filter((_, idx) => idx !== lastIndex),
				};
			}
		});
	},
	
	toggleBoughtByNameUnit: (name: string, unit: string) => {
		set((state) => {
			const groupIsBought = state.shoppingList
				.filter(item => item.name === name && item.unit === unit)
				.some(item => item.isBought);

			return {
				shoppingList: state.shoppingList.map(item =>
					item.name === name && item.unit === unit
						? { ...item, isBought: !groupIsBought }
						: item
				)
			};
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
			
			if (item.quantity <= decreaseAmount) {
				return {
					shoppingList: state.shoppingList.filter((_, idx) => idx !== lastIndex),
				};
			}
			
			return {
				shoppingList: state.shoppingList.map((item, idx) => 
					idx === lastIndex ? { ...item, quantity: item.quantity - decreaseAmount } : item
				),
			};
		});
	},
}));

export const sampleProducts: Product[] = [
	{ id: '1', name: 'Milk', quantity: 1, unit: 'l' },
	{ id: '2', name: 'Eggs', quantity: 12, unit: 'pcs' },
	{ id: '3', name: 'Butter', quantity: 250, unit: 'g' },
	{ id: '4', name: 'Cheese (Cheddar)', quantity: 200, unit: 'g' },
	{ id: '5', name: 'Yogurt', quantity: 500, unit: 'g' },
	{ id: '6', name: 'Cream', quantity: 200, unit: 'ml' },
	{ id: '7', name: 'Cottage Cheese', quantity: 250, unit: 'g' },
	{ id: '8', name: 'Sour Cream', quantity: 200, unit: 'ml' },
	{ id: '9', name: 'Bread', quantity: 1, unit: 'loaf' },
	{ id: '10', name: 'Bagels', quantity: 6, unit: 'pcs' },
	{ id: '11', name: 'Tortillas', quantity: 8, unit: 'pcs' },
	{ id: '12', name: 'Croissants', quantity: 4, unit: 'pcs' },
	{ id: '13', name: 'Hamburger Buns', quantity: 6, unit: 'pcs' },
	{ id: '14', name: 'Hot Dog Buns', quantity: 8, unit: 'pcs' },
	{ id: '15', name: 'Muffins', quantity: 6, unit: 'pcs' },
	{ id: '16', name: 'Pita Bread', quantity: 6, unit: 'pcs' },
	{ id: '17', name: 'Apples', quantity: 6, unit: 'pcs' },
	{ id: '18', name: 'Bananas', quantity: 1, unit: 'bunch' },
	{ id: '19', name: 'Oranges', quantity: 6, unit: 'pcs' },
	{ id: '20', name: 'Strawberries', quantity: 250, unit: 'g' },
	{ id: '21', name: 'Grapes', quantity: 500, unit: 'g' },
	{ id: '22', name: 'Blueberries', quantity: 125, unit: 'g' },
	{ id: '23', name: 'Lemons', quantity: 3, unit: 'pcs' },
	{ id: '24', name: 'Avocados', quantity: 2, unit: 'pcs' },
	{ id: '25', name: 'Pears', quantity: 4, unit: 'pcs' },
	{ id: '26', name: 'Watermelon', quantity: 1, unit: 'pc' },
	{ id: '27', name: 'Tomatoes', quantity: 4, unit: 'pcs' },
	{ id: '28', name: 'Potatoes', quantity: 1, unit: 'kg' },
	{ id: '29', name: 'Onions', quantity: 3, unit: 'pcs' },
	{ id: '30', name: 'Garlic', quantity: 1, unit: 'bulb' },
	{ id: '31', name: 'Lettuce', quantity: 1, unit: 'head' },
	{ id: '32', name: 'Carrots', quantity: 500, unit: 'g' },
	{ id: '33', name: 'Bell Peppers', quantity: 3, unit: 'pcs' },
	{ id: '34', name: 'Cucumbers', quantity: 2, unit: 'pcs' },
	{ id: '35', name: 'Broccoli', quantity: 1, unit: 'head' },
	{ id: '36', name: 'Spinach', quantity: 200, unit: 'g' },
	{ id: '37', name: 'Mushrooms', quantity: 250, unit: 'g' },
	{ id: '38', name: 'Zucchini', quantity: 2, unit: 'pcs' },
	{ id: '39', name: 'Chicken Breast', quantity: 500, unit: 'g' },
	{ id: '40', name: 'Ground Beef', quantity: 500, unit: 'g' },
	{ id: '41', name: 'Salmon Fillet', quantity: 300, unit: 'g' },
	{ id: '42', name: 'Bacon', quantity: 200, unit: 'g' },
	{ id: '43', name: 'Sausages', quantity: 6, unit: 'pcs' },
	{ id: '44', name: 'Pork Chops', quantity: 4, unit: 'pcs' },
	{ id: '45', name: 'Shrimp', quantity: 250, unit: 'g' },
	{ id: '46', name: 'Turkey', quantity: 500, unit: 'g' },
	{ id: '47', name: 'Ham', quantity: 200, unit: 'g' },
	{ id: '48', name: 'Rice', quantity: 1, unit: 'kg' },
	{ id: '49', name: 'Pasta', quantity: 500, unit: 'g' },
	{ id: '50', name: 'Flour', quantity: 1, unit: 'kg' },
	{ id: '51', name: 'Sugar', quantity: 1, unit: 'kg' },
	{ id: '52', name: 'Salt', quantity: 500, unit: 'g' },
	{ id: '53', name: 'Black Pepper', quantity: 100, unit: 'g' },
	{ id: '54', name: 'Olive Oil', quantity: 500, unit: 'ml' },
	{ id: '55', name: 'Vegetable Oil', quantity: 1, unit: 'l' },
	{ id: '56', name: 'Vinegar', quantity: 250, unit: 'ml' },
	{ id: '57', name: 'Honey', quantity: 250, unit: 'g' },
	{ id: '58', name: 'Peanut Butter', quantity: 350, unit: 'g' },
	{ id: '59', name: 'Jam', quantity: 300, unit: 'g' },
	{ id: '60', name: 'Cereal', quantity: 500, unit: 'g' },
	{ id: '61', name: 'Oats', quantity: 500, unit: 'g' },
	{ id: '62', name: 'Canned Tuna', quantity: 160, unit: 'g' },
	{ id: '63', name: 'Canned Beans', quantity: 400, unit: 'g' },
	{ id: '64', name: 'Canned Tomatoes', quantity: 400, unit: 'g' },
	{ id: '65', name: 'Canned Corn', quantity: 300, unit: 'g' },
	{ id: '66', name: 'Tomato Sauce', quantity: 500, unit: 'g' },
	{ id: '67', name: 'Soup', quantity: 400, unit: 'ml' },
	{ id: '68', name: 'Frozen Peas', quantity: 500, unit: 'g' },
	{ id: '69', name: 'Frozen Berries', quantity: 400, unit: 'g' },
	{ id: '70', name: 'Frozen Pizza', quantity: 1, unit: 'pc' },
	{ id: '71', name: 'Ice Cream', quantity: 1, unit: 'l' },
	{ id: '72', name: 'Frozen Vegetables Mix', quantity: 500, unit: 'g' },
	{ id: '73', name: 'Coffee', quantity: 250, unit: 'g' },
	{ id: '74', name: 'Tea', quantity: 50, unit: 'bags' },
	{ id: '75', name: 'Orange Juice', quantity: 1, unit: 'l' },
	{ id: '76', name: 'Soda', quantity: 2, unit: 'l' },
	{ id: '77', name: 'Water', quantity: 6, unit: 'bottles' },
	{ id: '78', name: 'Beer', quantity: 6, unit: 'bottles' },
	{ id: '79', name: 'Wine', quantity: 1, unit: 'bottle' },
	{ id: '80', name: 'Potato Chips', quantity: 200, unit: 'g' },
	{ id: '81', name: 'Pretzels', quantity: 300, unit: 'g' },
	{ id: '82', name: 'Nuts', quantity: 200, unit: 'g' },
	{ id: '83', name: 'Chocolate', quantity: 100, unit: 'g' },
	{ id: '84', name: 'Cookies', quantity: 300, unit: 'g' },
	{ id: '85', name: 'Popcorn', quantity: 100, unit: 'g' },
	{ id: '86', name: 'Ketchup', quantity: 500, unit: 'ml' },
	{ id: '87', name: 'Mustard', quantity: 200, unit: 'ml' },
	{ id: '88', name: 'Mayonnaise', quantity: 400, unit: 'ml' },
	{ id: '89', name: 'Soy Sauce', quantity: 250, unit: 'ml' },
	{ id: '90', name: 'Hot Sauce', quantity: 150, unit: 'ml' },
	{ id: '91', name: 'BBQ Sauce', quantity: 400, unit: 'ml' },
	{ id: '92', name: 'Salad Dressing', quantity: 250, unit: 'ml' },
	{ id: '93', name: 'Baking Powder', quantity: 150, unit: 'g' },
	{ id: '94', name: 'Baking Soda', quantity: 200, unit: 'g' },
	{ id: '95', name: 'Vanilla Extract', quantity: 50, unit: 'ml' },
	{ id: '96', name: 'Cocoa Powder', quantity: 200, unit: 'g' },
	{ id: '97', name: 'Chocolate Chips', quantity: 300, unit: 'g' },
	{ id: '98', name: 'Yeast', quantity: 10, unit: 'g' },
	{ id: '99', name: 'Almond Milk', quantity: 1, unit: 'l' },
	{ id: '100', name: 'Tofu', quantity: 400, unit: 'g' },
	{ id: '101', name: 'Oat Milk', quantity: 1, unit: 'l' },
	{ id: '102', name: 'Coconut Milk', quantity: 400, unit: 'ml' },
]; 