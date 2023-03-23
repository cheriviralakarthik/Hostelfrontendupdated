import React, {useState, useContext} from 'react';
import auth from '@react-native-firebase/auth';
import {MaterialIcons} from 'react-native-vector-icons';

import {store} from '../App';

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
  VStack,
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
  //getting the central store from contextapi
  const [data, setData] = useContext(store);

  // onchange on email input will be assinged here
  const [email, setEmail] = useState(null);

  //onchange on password field will be assigned here
  const [password, setPassword] = useState(null);

  const toast = useToast();

  //sign up function for validating the fields and api call to login route
  const validatesignup = async () => {
    try {
      // checking the validation
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

      //assigning the eamil,password field to the data object to send field via api call
      const datatosend = {
        email: email,
        password: password,
      };

      //api call to register route using 10.0.2.2 as ip because emulator will point the these ip to localhost
      const responce = await axios.post(
        'http://10.0.2.2:4000/register',
        datatosend,
      );
      if (responce.status == 201) {
        setData(responce.data);
      } else {
        console.log('error in sign in');
      }
    } catch (error) {
      console.log(error, 'error in signup');
    }
  };

  //sign in function for validating the fields and api call to login route
  const validatesignin = async () => {
    try {
      // checking the validation
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
      //assigning the eamil,password field to the data object to send field via api call
      const datatosend = {
        email: email,
        password: password,
      };

      //api call to login route using 10.0.2.2 as ip because emulator will point the these ip to localhost
      const responce = await axios.post(
        'http://10.0.2.2:4000/login',
        datatosend,
      );
      if (responce.status == 201) {
        setData(responce.data);
      } else {
        console.log('error in sign in');
      }
    } catch (error) {
      console.log(error, 'error in sign in ');
    }
  };

  return (
    <>
      <Box
        alignItems="center"
        marginTop="35%"
        ml="30"
        mr="30"
        borderRadius="lg"
        shadow="6"
        shadowColor="gray.800"
        justifyContent="center"
        backgroundColor="white">
        <VStack margin="10px" space={3} justifyContent="center">
          <Input placeholder="Email" w="100%" onChangeText={e => setEmail(e)} />
          <Input
            placeholder="Password"
            w="100%"
            type="password"
            onChangeText={e => setPassword(e)}
          />
        </VStack>
        <HStack margin="5px" space={5} justifyContent="center">
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
