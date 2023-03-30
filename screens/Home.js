import React, {useState, useEffect, useContext} from 'react';

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
import axios from 'axios';

//this is the home page
const Home = ({navigation}) => {
  //central data
  const [data, setData] = useContext(store);
  //storing the data of the home fetched from the api
  const [homedata, setHomedata] = useState(null);
  //to check if the data is fetched or not
  const [bool, setBool] = useState(false);

  //useEffect to fetch the data from the api on the first render
  useEffect(() => {
    gethome();
  }, []);

  //function to fetch the data from the api route getthehome
  const gethome = async () => {
    datatosend = {
      id: data.id,
    };
    //getting the homedata from the api route getthehome
    const responce = await axios.post(
      'http://10.0.2.2:4000/getthehome',
      datatosend,
    );
    //if the status is 200 then set the homedata and set the bool to true
    if (responce.status == 200) {
      setHomedata(responce.data);
      setBool(true);
    }
  };

  //function to signout
  const signout = () => {
    setData(false);
  };

  return (
    <ScrollView>
      {/* box contains logout button and create/view button to add floors or view floors*/}
      <Box margin="3" justifyContent="flex-end" flexDirection="row">
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
      {/* if the data is fetched then render  the data to the screen using map */}
      {bool &&
        homedata.map((floor, index) => (
          <Box key={index} marginTop="5" backgroundColor="#d4f0fc" rounded="sm">
            <Box
              backgroundColor="cyan.200"
              marginLeft="10"
              marginRight="10"
              marginTop="3"
              marginBottom="3">
              <Heading
                fontFamily="monospace"
                color="gray.500"
                size="md"
                alignSelf="center">{`Floor:${floor.floorno}`}</Heading>
            </Box>
            <ScrollView horizontal={true}>
              <Box
                marginBottom="5"
                bg={{
                  linearGradient: {
                    colors: ['lightBlue.200', 'violet.300'],
                    start: [0, 0],
                    end: [1, 0],
                  },
                }}
                rounded="xl"
                _web={{
                  shadow: 7,
                  borderWidth: 5,
                  borderColor: 'red.400',
                }}
                shadow="5"
                flexDirection="row">
                {floor.room.map((room, index) => (
                  <Box
                    key={index}
                    margin="5"
                    minWidth="150"
                    minHeight="150"
                    width="150"
                    bg={{
                      linearGradient: {
                        colors: ['lightBlue.500', 'violet.600'],
                        start: [0, 0],
                        end: [1, 0],
                      },
                    }}
                    rounded="xl"
                    _web={{
                      shadow: 7,
                      borderWidth: 5,
                      borderColor: 'red.400',
                    }}
                    _text={{
                      fontSize: 'md',
                      fontWeight: 'medium',
                      color: 'warmGray.50',
                    }}>
                    <Heading color="white" size="sm" alignSelf="center">
                      {`Room:${room.roomno}`}
                    </Heading>

                    <Divider
                      bg="white"
                      thickness="4"
                      orientation="horizontal"
                    />
                    <Box justifyContent="center" alignItems="center" margin="5">
                      <Box flexDirection="row">
                        <Text color="success.500" marginRight="1" fontSize="md">
                          ●
                        </Text>
                        <Text color="white" fontSize="md">
                          {room.capacity}
                        </Text>
                      </Box>
                      <Box flexDirection="row">
                        <Text color="yellow.500" marginRight="1" fontSize="md">
                          ●
                        </Text>
                        <Text color="white" fontSize="md">
                          {room.notpaid}
                        </Text>
                      </Box>
                      <Box flexDirection="row">
                        <Text color="rose.500" marginRight="1" fontSize="md">
                          ●
                        </Text>
                        <Text color="white" fontSize="md">
                          {room.pp}
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </ScrollView>
          </Box>
        ))}
    </ScrollView>
  );
};

export default Home;
