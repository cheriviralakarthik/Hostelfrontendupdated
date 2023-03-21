import React, {useState, useEffect, useContext} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import {store} from './App';

import {
  Button,
  Box,
  HStack,
  Pressable,
  Modal,
  FormControl,
  Center,
  Input,
  Popover,
  Flex,
  Heading,
  Container,
  Text,
  Divider,
  useToast,
} from 'native-base';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';

//this is the home page
const Home = ({navigation}) => {
  const [data, setData] = useContext(store);

  const toast = useToast();

  //TODO:remove firebase auth to add api auth
  const signout = () => {
    setData(false);
    auth()
      .signOut()
      .then(() => {
        toast.show({
          render: () => {
            return (
              <Box bg="red.400" px="2" py="1" rounded="sm" mb={5}>
                Logged out successfully
              </Box>
            );
          },
        });
      });
  };

  return (
    <ScrollView>
      <Box margin="5" justifyContent="flex-end" flexDirection="row">
        <Button
          variant="subtle"
          colorScheme="secondary"
          onPress={() => signout()}>
          Logout
        </Button>
      </Box>
      <Box justifyContent="space-around" flexDirection="row" margin="5">
        <Button onPress={() => navigation.navigate('Floor')}>
          Create/View
        </Button>
      </Box>
    </ScrollView>
  );
};

export default Home;
