import { ImageSourcePropType } from 'react-native';

const images = {
	diary: require('../assets/categories/diary.png'),
	bread: require('../assets/categories/bread.png'),
	vegetablesFruits: require('../assets/categories/vegetables-fruits.png'),
	meat: require('../assets/categories/meat.png'),
	jam: require('../assets/categories/jam.png'),
	frozen: require('../assets/categories/frozen.png'),
	water: require('../assets/categories/water.png'),
	snack: require('../assets/categories/snack.png'),
	condiments: require('../assets/categories/condiments.png'),
	baking: require('../assets/categories/baking.png'),
	alternative: require('../assets/categories/alternative.png'),
};

export const categoryImages: Record<string, ImageSourcePropType> = {
	'Dairy': images.diary,
	'Bread & Bakery': images.bread,
	'Fruits': images.vegetablesFruits,
	'Vegetables': images.vegetablesFruits,
	'Meat & Seafood': images.meat,
	'Pantry Items': images.jam,
	'Canned Goods': images.jam,
	'Frozen Foods': images.frozen,
	'Beverages': images.water,
	'Snacks': images.snack,
	'Condiments': images.condiments,
	'Baking': images.baking,
	'Dairy Alternatives': images.alternative,
};

export function getCategoryImage(category: string): ImageSourcePropType | null {
	return categoryImages[category] || null;
} 