import React, {useState, useEffect, useContext} from 'react';

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
  Heading,
  Radio,
  Text,
  AlertDialog,
} from 'native-base';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';

const Addbed = ({route, navigation}) => {
  //central state to store or retrieve the data
  const [data, setData] = useContext(store);

  // collecting data from the user to add bed information
  const [name, setName] = useState(null);
  const [address, setAddress] = useState(null);
  const [aadhar, setAadhar] = useState(null);
  const [amountpaid, setAmountpaid] = useState(null);
  const [typeofamountpaid, setTypeofamountpaid] = useState('notpaid');

  //these three  states are used in noofbeds function to get the count of beds in a room
  const [bedsdata, setbedsdata] = useState([]);
  const [countofbeds, setCountofbeds] = useState(0);
  const [bool, setbool] = useState(false);

  //state to store the capacity of the room taken from user input
  const [capacity, setcapacity] = useState(null);

  //state to store the bed details when clicked on the bed box
  const [beddetails, setBeddetails] = useState(null);

  //to show the data of bed when clicked on the bed box
  const [isOpen, setIsOpen] = useState(false);

  //to open input form to add bed
  const [showModal, setShowModal] = useState(false);

  const [showalertbox, setShowalertbox] = useState(false);

  //param to get the floorno and roomno from the previous screen
  const {roomno, floorno} = route.params;

  //function to close the user input form to add bed details
  const onClose = () => setIsOpen(false);

  //useEffect to call the noofbeds function when the screen is loaded
  useEffect(() => {
    noofbeds();
  }, []);

  //function to get the no of beds in a room
  const noofbeds = async () => {
    try {
      //object to send the data via api call
      const datatosend = {
        id: data.id,
        floorno: floorno,
        roomno: roomno,
      };

      //api call to getbeds route using 10.0.2.2 as ip because emulator will point the these ip to localhost
      const responce = await axios.post(
        'http://10.0.2.2:4000/getbeds',
        datatosend,
      );
      if (responce.status == 200) {
        //calling the getcapacity function to get the capacity of the room
        getcapacity();
        console.log(responce.data);
        //setting the data to bedstate to render it
        setbedsdata(responce.data);
        //setting the count of beds
        setCountofbeds(responce.data.length);
        //setting the bool to true to render the data
        setbool(true);
      } else {
        console.log('error in getting beds');
      }
    } catch (error) {
      console.log('error in getting beds');
      console.log(error);
    }
  };

  //function to get the capacity of the room
  const getcapacity = async () => {
    try {
      //object to send the data via api call
      const datatosend = {
        id: data.id,
        floorno: floorno,
        roomno: roomno,
      };

      //api call to getroomcapacity route
      const responce = await axios.post(
        'http://10.0.2.2:4000/getroomcapacity',
        datatosend,
      );
      if (responce.status == 200) {
        console.log(responce.data[0]);
        //setting the capacity to the state
        setcapacity(responce.data[0]);
      } else {
        console.log('error in getting room capacity');
      }
    } catch (error) {
      console.log(error);
    }
  };

  //function to add the bed to the room
  const addbed = async () => {
    try {
      //object to send the data via api call
      const datatosend = {
        id: data.id,
        floorno: floorno,
        roomno: roomno,
        bedno: countofbeds + 1,
        name: name,
        address: address,
        aadhar: aadhar,
        amountpaid: amountpaid,
        typeofamountpaid: typeofamountpaid,
      };

      //api call to addroom route using 10.0.2.2 as ip because emulator will point the these ip to localhost
      const responce = await axios.post(
        'http://10.0.2.2:4000/addbed',
        datatosend,
      );
      if (responce.status == 200) {
        console.log(responce.data);
        //calling the function to get the beds again to render the added  room
        noofbeds();
      } else {
        console.log('error add room');
      }
    } catch (error) {
      console.log(error);
    }
  };

  //function to get the details of the bed
  const getbeddetails = async bedno => {
    try {
      //object to send the data via api call
      const datatosend = {
        id: data.id,
        floorno: floorno,
        roomno: roomno,
        bedno: bedno,
      };

      //api call to getbeddetails route using
      const responce = await axios.post(
        'http://10.0.2.2:4000/thebeddetails',
        datatosend,
      );
      if (responce.status == 200) {
        console.log(responce.data);
        setBeddetails(responce.data);
        setShowalertbox(true);
      }
    } catch (error) {
      console.log("error in getting bed's details");
      console.log(error);
    }
  };

  return (
    <>
      <ScrollView>
        <Box margin="10px" alignItems="center">
          <Heading>{`Available beds  ${capacity}`}</Heading>
        </Box>
        <Box alignItems="flex-end" margin="5">
          <Button onPress={() => setShowModal(true)}>Add Bed</Button>
        </Box>
        {/* popover of alert box to show user details */}
        {showalertbox && (
          <AlertDialog isOpen={isOpen} onClose={onClose}>
            <AlertDialog.Content>
              <AlertDialog.CloseButton />
              <AlertDialog.Header>Bed Details</AlertDialog.Header>
              <AlertDialog.Body>
                <Text fontSize="md"> Name: {beddetails.name}</Text>
                <Text fontSize="md"> Amounttype: {beddetails.address}</Text>
                <Text fontSize="md"> AadharNo: {beddetails.aadhar}</Text>
                <Text fontSize="md">
                  {' '}
                  Typeofamount: {beddetails.typeofamountpaid}
                </Text>
                <Text fontSize="md"> Amountpaid: {beddetails.amountpaid}</Text>
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button.Group space={2}>
                  <Button
                    colorScheme="secondary"
                    variant="outline"
                    onPress={onClose}>
                    Cancel
                  </Button>
                </Button.Group>
              </AlertDialog.Footer>
            </AlertDialog.Content>
          </AlertDialog>
        )}
        {/* rendering the noofbeds  */}
        {bool && (
          <Box alignItems="center" margin="10px">
            {bedsdata.map((da, index) => (
              <Box key={index} margin="5px" width="50%">
                <Pressable
                  onPress={() => {
                    getbeddetails(da);
                    setIsOpen(!isOpen);
                  }}
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
      <Center>
        {/* popover for getting the user datails to add bed  */}
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>Fill the Details</Modal.Header>
            <Modal.Body>
              <FormControl>
                <FormControl.Label>Name</FormControl.Label>
                <Input onChangeText={e => setName(e)} />
              </FormControl>
              <FormControl mt="3">
                <FormControl.Label>adress</FormControl.Label>
                <Input onChangeText={e => setAddress(e)} />
              </FormControl>
              <FormControl mt="3">
                <FormControl.Label>Aadhar no</FormControl.Label>
                <Input onChangeText={e => setAadhar(e)} />
              </FormControl>
              <FormControl mt="3">
                <FormControl.Label>amount paid</FormControl.Label>
                <Input onChangeText={e => setAmountpaid(e)} />
              </FormControl>
              <Radio.Group
                margin="10px"
                name="myRadioGroup"
                accessibilityLabel="amount type"
                value={typeofamountpaid}
                onChange={nextValue => {
                  setTypeofamountpaid(nextValue);
                }}>
                <Radio value="paid" my={1}>
                  paid
                </Radio>
                <Radio value="notpaid" my={1}>
                  not paid
                </Radio>
                <Radio value="pp" my={1}>
                  partially paid
                </Radio>
              </Radio.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button
                  variant="ghost"
                  colorScheme="blueGray"
                  onPress={() => {
                    setShowModal(false);
                  }}>
                  Cancel
                </Button>
                <Button
                  onPress={() => {
                    addbed();
                    setShowModal(false);
                  }}>
                  Save
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </Center>
    </>
  );
};

export default Addbed;
