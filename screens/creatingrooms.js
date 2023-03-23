import React, {useState, useEffect, useContext} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import {store} from '../App';

import axios from 'axios';

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
  //state to store the data of rooms in a floor
  const [roomsdata, setRoomsdata] = useState([]);

  //state to store the count of rooms in a floor calculated from api call
  const [countofrooms, setCountofrooms] = useState(0);

  //bool to check if the data is fetched or not in noofrooms function
  const [bool, setbool] = useState(false);

  //state to store the capacity of the room taken from user input
  const [capacity, setCapacity] = useState(null);

  //state to store the roomno of the room taken from user input
  const [roomno, setRoomno] = useState(null);

  //state to know if add room button clicked or not
  const [isOpen, setIsOpen] = useState(false);

  //central state to store or retrieve the data
  const [data, setData] = useContext(store);

  //getting the floorno from the previous screen
  const {floorno} = route.params;

  //useEffect to call the noofrooms function when the screen is loaded
  useEffect(() => {
    noofrooms();
  }, []);

  //function to get the no of rooms in a floor
  const noofrooms = async () => {
    try {
      //object to send the data via api call
      const datatosend = {
        id: data.id,
        floorno: floorno,
      };

      //api call to register route using 10.0.2.2 as ip because emulator will point the these ip to localhost
      const responce = await axios.post(
        'http://10.0.2.2:4000/getrooms',
        datatosend,
      );
      if (responce.status == 200) {
        console.log(responce.data);
        //setting the data to roomstate to render it
        setRoomsdata(responce.data);
        //setting the count of rooms
        setCountofrooms(responce.data.length);
        //setting the bool to true to render the data
        setbool(true);
      } else {
        console.log('error in getting rooms');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addroom = async () => {
    try {
      //object to send the data via api call
      const datatosend = {
        id: data.id,
        floorno: floorno,
        roomno: roomno,
        capacity: capacity,
      };

      //api call to addroom route using 10.0.2.2 as ip because emulator will point the these ip to localhost
      const responce = await axios.post(
        'http://10.0.2.2:4000/addroom',
        datatosend,
      );
      if (responce.status == 200) {
        console.log(responce.data);
        //calling the function to get the rooms again to render the added  room
        noofrooms();
      } else {
        console.log('error add room');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView>
      <Box alignItems="flex-end" margin="5px">
        {/* popover for taking the capacity and roomno from user */}
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
      {/* redering the roomsdata while itearting each and rendering using map */}
      {bool && (
        <Box alignItems="center" margin="10px">
          {roomsdata.map((da, index) => (
            <Box key={index} margin="5px" width="50%">
              <Pressable
                onPress={() =>
                  navigation.navigate('Bed', {
                    roomno: da,
                    floorno: floorno,
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
