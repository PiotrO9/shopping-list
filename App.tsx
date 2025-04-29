import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import AllProductsScreen from './screens/AllProductsScreen';
import ShoppingListScreen from './screens/ShoppingListScreen';
import { useShoppingStore } from './store/useShoppingStore';

type RootStackParamList = {
	ShoppingList: undefined;
	AllProducts: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
	const { initializeStore, isInitialized } = useShoppingStore();
	
	useEffect(() => {
		// Initialize store and load data from AsyncStorage
		initializeStore();
	}, [initializeStore]);
	
	// Show loading indicator while store is initializing
	if (!isInitialized) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator size="large" color="#0000ff" />
			</View>
		);
	}
	
	return (
		<NavigationContainer>
			<Stack.Navigator
				initialRouteName="ShoppingList"
				screenOptions={{
					headerShown: false,
					contentStyle: { backgroundColor: '#f5f5f5' },
				}}
			>
				<Stack.Screen name="ShoppingList" component={ShoppingListScreen} />
				<Stack.Screen 
					name="AllProducts" 
					component={AllProductsScreen}
					options={{
						presentation: 'modal',
						animation: 'slide_from_bottom',
					}}
				/>
			</Stack.Navigator>
			<StatusBar style="auto" />
		</NavigationContainer>
	);
}
