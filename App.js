import React, {useEffect, createContext, useState} from 'react';
import {Button, NativeBaseProvider, Box} from 'native-base';
import LinearGradient from 'react-native-linear-gradient';

//importing screens
import Login from './screens/login';
import AddFloor from './screens/creatingfloor';
import Addroom from './screens/creatingrooms';
import Addbed from './screens/addingbed';
import Home from './screens/Home';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
export const store = createContext();

//this is the main app linked to the index.js file in the root directory
const App = () => {
  //config file for nativebase to get linear gradient
  const config = {
    dependencies: {
      'linear-gradient': LinearGradient,
    },
  };
  const [data, setData] = useState(false);

  return (
    <store.Provider value={[data, setData]}>
      <NativeBaseProvider config={config}>
        <NavigationContainer>
          <Stack.Navigator>
            {data == false ? (
              <Stack.Screen
                name="Log in"
                component={Login}
                options={{
                  statusBarColor: 'black',
                  title: 'Log in',
                  headerStyle: {
                    height: 150,
                    backgroundColor: 'black',
                    borderBottomLeftRadius: 10,

                    borderWidth: 10,
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                  headerTitleAlign: 'center',
                }}
              />
            ) : (
              <>
                <Stack.Screen
                  name="Home"
                  component={Home}
                  options={{
                    statusBarColor: '#42c5f5',
                    headerStyle: {
                      backgroundColor: '#42c5f5',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                      fontWeight: 'bold',
                    },
                    headerTitleAlign: 'center',
                  }}
                />
                <Stack.Screen name="Floor" component={AddFloor} />
                <Stack.Screen name="Room" component={Addroom} />
                <Stack.Screen name="Bed" component={Addbed} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    </store.Provider>
  );
};

export default App;
