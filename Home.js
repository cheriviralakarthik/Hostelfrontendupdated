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
  const [tdata, setTdata] = useState([]);
  const [pdata, setPdata] = useState([]);
  const [data, setData] = useContext(store);
  var uid = auth().currentUser.uid;
  const toast = useToast();

  useEffect(() => {
    nooffloors();
  });

  const nooffloors = async () => {
    var arr = [];
    await firestore()
      .collection('users')
      .doc(uid)
      .collection('Floors')
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          arr.push({[doc.id]: doc._data});
        });

        setTdata(arr);
      });
  };

  const func = params => {
    const ar = [];
    for (var floor in tdata) {
      rooms = Object.keys(tdata[floor]);
      if (params[0] == rooms[0]) {
        rkey = Object.keys(tdata[floor][rooms]);
        for (let r in rkey) {
          //start
          let avai = tdata[floor][params[0]][rkey[r]]['availablebeds'];
          let notpaid = 0;
          let paid = 0;
          for (let x in tdata[floor][params[0]][rkey[r]]) {
            if (x != 'availablebeds' && x != 'capacity') {
              for (let y in tdata[floor][params[0]][rkey[r]][x]) {
                if (y == 'Amounttype') {
                  if (tdata[floor][params[0]][rkey[r]][x][y] == 'notpaid') {
                    notpaid = notpaid + 1;
                  } else if (tdata[floor][params[0]][rkey[r]][x][y] == 'paid') {
                    paid = paid + 1;
                  }
                }
              }
            }
          }
          //end
          ar.push(
            <Box key={r}>
              <Text color="blueGray.700" fontSize="lg">
                {rkey[r]}
              </Text>
              <Box flexDirection="row">
                <Text color="success.100" marginRight="1" fontSize="md">
                  ●
                </Text>
                <Text color="white" fontSize="md">
                  {avai}
                </Text>
              </Box>
              <Box flexDirection="row">
                <Text color="yellow.400" marginRight="1" fontSize="md">
                  ●
                </Text>
                <Text color="white" fontSize="md">
                  {notpaid}
                </Text>
              </Box>
              <Box flexDirection="row">
                <Text color="rose.400" marginRight="1" fontSize="md">
                  ●
                </Text>
                <Text color="white" fontSize="md">
                  {paid}
                </Text>
              </Box>
            </Box>,
          );
        }
      }
    }
    return ar;
  };

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

      <Box
        flexDirection="row"
        flexWrap="wrap"
        justifyContent="space-evenly"
        flex="1">
        {tdata
          .map(data => Object.keys(data))
          .map(lt => (
            <Box
              key={lt}
              margin="5px"
              bg={{
                linearGradient: {
                  colors: ['lightBlue.500', 'violet.800'],
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
              <Heading color="white" size="md" alignSelf="center">
                {lt}
              </Heading>

              <Divider
                bg="emerald.500"
                thickness="4"
                orientation="horizontal"
              />

              <Box
                flexDirection="row"
                flexWrap="wrap"
                justifyContent="space-between">
                {func(lt).map((rdata, index) => (
                  <Box
                    width="80px"
                    justifyContent="center"
                    alignItems="center"
                    margin="5px"
                    key={index}
                    p="3"
                    rounded="xl"
                    _web={{
                      shadow: 2,
                      borderWidth: 2,
                    }}
                    _light={{
                      backgroundColor: 'green.500',
                    }}
                    _text={{
                      fontSize: 'md',
                      fontWeight: 'medium',
                      color: 'warmGray.50',
                    }}>
                    {rdata}
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
      </Box>
    </ScrollView>
  );
};

export default Home;
