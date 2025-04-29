import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, SectionList, TextInput, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProductItem from '../components/ProductItem';
import { sampleProducts } from '../store/useShoppingStore';
import { getCategoryImage } from '../utils/categoryImages';

const categories = [
	"Dairy", // diary.png
	"Bread & Bakery", // bread.png
	"Fruits", // vegetables-fruits.png
	"Vegetables", // vegetables-fruits.png
	"Meat & Seafood", // meat.png
	"Pantry Items", // jam.png
	"Canned Goods", // jam.png
	"Frozen Foods", // frozen.png
	"Beverages", // water.png
	"Snacks", // snack.png
	"Condiments", // condiments.png
	"Baking", // baking.png
	"Dairy Alternatives" // alternative.png
];

const categoryRanges = [
	{ category: "Dairy", start: 1, end: 8 },
	{ category: "Bread & Bakery", start: 9, end: 16 },
	{ category: "Fruits", start: 17, end: 26 },
	{ category: "Vegetables", start: 27, end: 38 },
	{ category: "Meat & Seafood", start: 39, end: 47 },
	{ category: "Pantry Items", start: 48, end: 61 },
	{ category: "Canned Goods", start: 62, end: 67 },
	{ category: "Frozen Foods", start: 68, end: 72 },
	{ category: "Beverages", start: 73, end: 79 },
	{ category: "Snacks", start: 80, end: 85 },
	{ category: "Condiments", start: 86, end: 92 },
	{ category: "Baking", start: 93, end: 98 },
	{ category: "Dairy Alternatives", start: 99, end: 102 }
];

function AllProductsScreen() {
	const navigation = useNavigation();
	const [searchText, setSearchText] = useState('');
	const [isQuickMode, setIsQuickMode] = useState(false);

	function handleClose() {
		navigation.goBack();
	}

	const sections = useMemo(() => {
		return categoryRanges.map(range => {
			const productsInCategory = sampleProducts.filter(product => {
				const id = parseInt(product.id);
				return id >= range.start && id <= range.end;
			});
			
			return {
				title: range.category,
				data: productsInCategory
			};
		});
	}, []);

	const filteredSections = useMemo(() => {
		if (!searchText.trim()) {
			return sections;
		}
		
		const searchLower = searchText.toLowerCase();
		return sections
			.map(section => ({
				title: section.title,
				data: section.data.filter(product => 
					product.name.toLowerCase().includes(searchLower)
				)
			}))
			.filter(section => section.data.length > 0);
	}, [sections, searchText]);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity 
					style={styles.closeButton}
					onPress={handleClose}
					accessibilityLabel="Close"
					accessibilityRole="button"
				>
					<Text style={styles.closeButtonText}>✕</Text>
				</TouchableOpacity>
				
				<Text style={styles.headerTitle}>All Products</Text>
				
				<TouchableOpacity 
					style={[styles.modeButton, isQuickMode && styles.activeButton]}
					onPress={() => setIsQuickMode(!isQuickMode)}
					accessibilityLabel={isQuickMode ? "Switch to normal mode" : "Switch to quick edit mode"}
					accessibilityRole="button"
				>
					<Text style={styles.modeButtonText}>{isQuickMode ? "Normal" : "Quick Edit"}</Text>
				</TouchableOpacity>
			</View>
			
			<View style={styles.searchContainer}>
				<TextInput
					style={styles.searchInput}
					placeholder="Search products..."
					value={searchText}
					onChangeText={setSearchText}
					clearButtonMode="while-editing"
				/>
			</View>
			
			<SectionList
				sections={filteredSections}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<ProductItem
						id={item.id}
						name={item.name}
						quantity={item.quantity}
						unit={item.unit}
						isEditing={isQuickMode}
						category={item.category}
					/>
				)}
				renderSectionHeader={({ section: { title } }) => {
					const categoryImageSource = getCategoryImage(title);
					return (
						<View style={styles.sectionHeader}>
							<View style={styles.sectionHeaderContent}>
								{categoryImageSource && (
									<View style={styles.sectionHeaderImageContainer}>
										<Image 
											source={categoryImageSource}
											style={styles.sectionHeaderImage}
											resizeMode="contain"
										/>
									</View>
								)}
								<Text style={styles.sectionHeaderText}>{title}</Text>
							</View>
						</View>
					);
				}}
				stickySectionHeadersEnabled={true}
				ListEmptyComponent={() => (
					<View style={styles.emptyContainer}>
						<Text style={styles.emptyText}>No products found matching "{searchText}"</Text>
					</View>
				)}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
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
	closeButton: {
		width: 32,
		height: 32,
		alignItems: 'center',
		justifyContent: 'center',
	},
	closeButtonText: {
		fontSize: 20,
		color: 'white',
		fontWeight: 'bold',
	},
	modeButton: {
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 12,
	},
	activeButton: {
		backgroundColor: 'rgba(255, 255, 255, 0.4)',
	},
	modeButtonText: {
		color: 'white',
		fontWeight: '600',
		fontSize: 14,
	},
	searchContainer: {
		padding: 12,
		backgroundColor: 'white',
		borderBottomWidth: 1,
		borderBottomColor: '#e0e0e0',
	},
	searchInput: {
		backgroundColor: '#f0f0f0',
		paddingHorizontal: 16,
		paddingVertical: 10,
		borderRadius: 20,
		fontSize: 16,
	},
	sectionHeader: {
		backgroundColor: '#e8f5e9',
		padding: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#c8e6c9',
	},
	sectionHeaderContent: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	sectionHeaderImageContainer: {
		width: 24,
		height: 24,
		borderRadius: 12,
		backgroundColor: '#f0f9f0',
		marginRight: 8,
		padding: 4,
		justifyContent: 'center',
		alignItems: 'center',
	},
	sectionHeaderImage: {
		width: '100%',
		height: '100%',
	},
	sectionHeaderText: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#2e7d32',
	},
	emptyContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
		marginTop: 40,
	},
	emptyText: {
		fontSize: 16,
		color: '#666',
		textAlign: 'center',
	},
});

export default AllProductsScreen; 