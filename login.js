import React, {useState, useContext} from 'react';
import auth from '@react-native-firebase/auth';
import {MaterialIcons} from 'react-native-vector-icons';

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
  Stack,
  Icon,
  AddIcon,
  useToast,
} from 'native-base';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import axios from 'axios';

const Login = () => {
  const [data, setData] = useContext(store);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const toast = useToast();

  const validatesignup = () => {
    if (email.length < 6 || password.length < 6) {
      toast.show({
        render: () => {
          return (
            <Box bg="danger.600" px="2" py="1" rounded="sm" mb={5}>
              Fill the fields perfectly!!!!
            </Box>
          );
        },
      });
      return;
    }
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        toast.show({
          render: () => {
            return (
              <Box bg="emerald.500" px="2" py="1" rounded="sm" mb={5}>
                Logged in successfully
              </Box>
            );
          },
        });
        setData(true);
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  };

  const validatesignin = () => {
    if (email.length < 6 || password.length < 6) {
      toast.show({
        render: () => {
          return (
            <Box bg="danger.600" px="2" py="1" rounded="sm" mb={5}>
              Fill the fields perfectly!!!!
            </Box>
          );
        },
      });
      return;
    }
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        toast.show({
          render: () => {
            return (
              <Box bg="emerald.500" px="2" py="1" rounded="sm" mb={5}>
                Logged in successfully
              </Box>
            );
          },
        });
        setData(true);
      })
      .catch(error => {
        console.log(data);

        console.error(error);
      });
  };

  return (
    <>
      <Box alignItems="center" margin="20" justifyContent="center">
        <Input
          mx="3"
          placeholder="Email"
          w="100%"
          onChangeText={e => setEmail(e)}
        />
        <Input
          mt="5"
          mx="3"
          placeholder="Password"
          w="100%"
          type="password"
          onChangeText={e => setPassword(e)}
        />
        <HStack margin="5px" space={3} justifyContent="center">
          <Button
            size="md"
            mt="4"
            variant="solid"
            colorScheme="green"
            onPress={() => validatesignin()}>
            Signin
          </Button>
          <Button
            size="md"
            mt="4"
            variant="solid"
            colorScheme="green"
            onPress={() => validatesignup()}>
            Signup
          </Button>
        </HStack>
      </Box>
    </>
  );
};

export default Login;
