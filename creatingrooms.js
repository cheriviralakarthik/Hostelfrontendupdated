import React, {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

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
  Text,
} from 'native-base';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';

const Addroom = ({route, navigation}) => {
  const [roomsdata, setRoomsdata] = useState([]);
  const [countofrooms, setCountofrooms] = useState(0);
  const [bool, setbool] = useState(false);
  const [capacity, setCapacity] = useState(null);
  const [roomno, setRoomno] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const {floorid} = route.params;
  var uid = auth().currentUser.uid;

  useEffect(() => {
    noofrooms();
  }, [roomsdata]);

  const noofrooms = async () => {
    const data = await firestore()
      .collection('users')
      .doc(uid)
      .collection('Floors')
      .doc(`${floorid}`)
      .get();
    const arr = Object.keys(data._data);

    setRoomsdata(arr);

    setCountofrooms(arr.length);
    setbool(true);
  };

  const addroom = () => {
    console.log('triggres');
    firestore()
      .collection('users')
      .doc(uid)
      .collection('Floors')
      .doc(`${floorid}`)
      .update({
        [roomno]: {
          capacity: capacity,
          availablebeds: capacity,
        },
      });
  };

  return (
    <ScrollView>
      <Box alignItems="flex-end" margin="5px">
        <Popover
          placement="left top"
          trigger={triggerProps => {
            return (
              <Button {...triggerProps} onPress={() => setIsOpen(true)}>
                Add Room
              </Button>
            );
          }}
          isOpen={isOpen}
          onClose={() => setIsOpen(!isOpen)}>
          <Popover.Content width="56">
            <Popover.Arrow />
            <Popover.CloseButton />
            {/* @ts-ignore */}
            <Popover.Header>Enter the capacity of room</Popover.Header>
            <Popover.Body>
              <FormControl>
                <FormControl.Label
                  _text={{
                    fontSize: 'xs',
                    fontWeight: 'medium',
                  }}>
                  No of beds
                </FormControl.Label>
                <Input
                  rounded="sm"
                  fontSize="xs"
                  onChangeText={e => setCapacity(e)}
                />
                <FormControl.Label
                  _text={{
                    fontSize: 'xs',
                    fontWeight: 'medium',
                  }}>
                  Room No
                </FormControl.Label>
                <Input
                  rounded="sm"
                  fontSize="xs"
                  onChangeText={e => setRoomno(e)}
                />
              </FormControl>
            </Popover.Body>
            <Popover.Footer>
              <Button.Group>
                <Button
                  onPress={() => {
                    addroom();
                    setIsOpen(false);
                  }}>
                  Add
                </Button>
              </Button.Group>
            </Popover.Footer>
          </Popover.Content>
        </Popover>
      </Box>

      {bool && (
        <Box alignItems="center" margin="10px">
          {roomsdata.map((da, index) => (
            <Box key={index} margin="5px" width="50%">
              <Pressable
                onPress={() =>
                  navigation.navigate('Bed', {
                    rono: da,
                    flno: floorid,
                  })
                }
                rounded="8"
                overflow="hidden"
                borderWidth="1"
                borderColor="coolGray.300"
                maxW="96"
                shadow="3"
                bg="coolGray.100"
                p="5">
                <Box justifyContent="center" alignItems="center">
                  <Text fontWeight="light" fontSize="sm">
                    {da}
                  </Text>
                </Box>
              </Pressable>
            </Box>
          ))}
        </Box>
      )}
    </ScrollView>
  );
};

export default Addroom;
