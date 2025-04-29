import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export type GroupingMethod = 'category' | 'alphabetical' | 'quantity';
export type SortDirection = 'asc' | 'desc';

type GroupingSelectorProps = {
	currentGrouping: GroupingMethod;
	sortDirection: SortDirection;
	onGroupingChange: (grouping: GroupingMethod, direction: SortDirection) => void;
};

function GroupingSelector({ currentGrouping, sortDirection, onGroupingChange }: GroupingSelectorProps) {
	function handlePress(method: GroupingMethod) {
		if (method === currentGrouping) {
			onGroupingChange(method, sortDirection === 'asc' ? 'desc' : 'asc');
		} else {
			onGroupingChange(method, 'asc');
		}
  }

	return (
		<View style={styles.container}>
		<TouchableOpacity 
			style={[styles.button, currentGrouping === 'category' && styles.activeButton]}
			onPress={() => handlePress('category')}
			activeOpacity={0.7}
			accessibilityLabel="Sort by category"
			accessibilityRole="button"
			accessibilityState={{ selected: currentGrouping === 'category' }}
		>
			<Text style={[styles.buttonText, currentGrouping === 'category' && styles.activeButtonText]}>
				Category
			</Text>
		</TouchableOpacity>

		<TouchableOpacity 
			style={[styles.button, currentGrouping === 'alphabetical' && styles.activeButton]}
			onPress={() => handlePress('alphabetical')}
			activeOpacity={0.7}
			accessibilityLabel={`Sort alphabetically ${sortDirection === 'asc' ? 'ascending' : 'descending'}`}
			accessibilityRole="button"
			accessibilityState={{ selected: currentGrouping === 'alphabetical' }}
		>
			<Text style={[styles.buttonText, currentGrouping === 'alphabetical' && styles.activeButtonText]}>
				A-Z {currentGrouping === 'alphabetical' && (sortDirection === 'asc' ? '↑' : '↓')}
			</Text>
		</TouchableOpacity>

		<TouchableOpacity 
			style={[styles.button, currentGrouping === 'quantity' && styles.activeButton]}
			onPress={() => handlePress('quantity')}
			activeOpacity={0.7}
			accessibilityLabel={`Sort by quantity ${sortDirection === 'asc' ? 'ascending' : 'descending'}`}
			accessibilityRole="button"
			accessibilityState={{ selected: currentGrouping === 'quantity' }}
		>
			<Text style={[styles.buttonText, currentGrouping === 'quantity' && styles.activeButtonText]}>
				Quantity {currentGrouping === 'quantity' && (sortDirection === 'asc' ? '↑' : '↓')}
			</Text>
		</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		padding: 8,
		backgroundColor: 'white',
		borderBottomWidth: 1,
		borderBottomColor: '#e0e0e0',
	},
	button: {
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 16,
		marginRight: 8,
		backgroundColor: '#f0f9f0',
	},
	activeButton: {
		backgroundColor: '#4CAF50',
	},
	buttonText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#4CAF50',
	},
	activeButtonText: {
		color: 'white',
	},
});

export default GroupingSelector; 