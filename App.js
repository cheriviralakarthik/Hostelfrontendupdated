import React, {useEffect, createContext, useState} from 'react';
import database from '@react-native-firebase/database';
import {Button, NativeBaseProvider, Box} from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import Login from './login';
import AddFloor from './creatingfloor';
import Addroom from './creatingrooms';
import Addbed from './addingbed';
import Home from './Home';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
export const store = createContext();

const App = () => {
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
                    borderBottomLeftRadius: 50,
                    borderBottomRightRadius: 50,
                    shadowcolor: 'lightgreen',
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                }}
              />
            ) : (
              <>
                <Stack.Screen name="Home" component={Home} />
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
