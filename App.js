import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from './src/components/Home/Home';
import MyTickets from './src/components/MyTickets/MyTickets';
import Ionic from 'react-native-vector-icons/Ionicons';
import MovieDetails from './src/components/MovieDetails/MovieDetails';

const App = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  const BottomTabs = () => {
    return (
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarShowLabel: false,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#1A1A23',
            borderTopEndRadius: 10,
            borderTopStartRadius: 10,
            position: 'absolute',
            borderTopColor: 'transparent',
            elevation: 0,
            height: 54,
            overflow: 'hidden',
          },
          tabBarIcon: ({focused, colour}) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused ? 'home-sharp' : 'home-outline';
              colour = focused && '#ffffff';
            } else if (route.name === 'MyTickets') {
              iconName = focused ? 'film' : 'film-outline';
              colour = focused && '#ffffff';
            }
            return (
              <>
                <Ionic
                  name={iconName}
                  style={{marginBottom: 4}}
                  size={22}
                  color={colour ? colour : '#ffffff40'}
                />
                <Ionic
                  name="ellipse"
                  style={{display: colour ? 'flex' : 'none'}}
                  size={4}
                  color={colour ? colour : 'transparent'}
                />
              </>
            );
          },
        })}>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="MyTickets" component={MyTickets} />
      </Tab.Navigator>
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="BottomTabs" component={BottomTabs} />
        <Stack.Screen name="MovieDetails" component={MovieDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
