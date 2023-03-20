import React, {useState, useEffect} from 'react';
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
  Heading,
  Radio,
  Text,
  AlertDialog,
} from 'native-base';
import firestore from '@react-native-firebase/firestore';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';

const Addbed = ({route, navigation}) => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState(null);
  const [address, setAddress] = useState(null);
  const [tdata, setTdata] = useState([]);
  const [disname, setDisname] = useState(null);
  const [disamounttype, setDisamounttype] = useState(null);
  const [disamountpaid, setDisamountpaid] = useState(null);
  const [] = useState(null);
  // TODO:change age to aadhar
  const [age, setAge] = useState(null);
  const [amountpaid, setAmountpaid] = useState(null);
  const [bedsdata, setbedsdata] = useState([]);
  const [countofbeds, setCountofbeds] = useState(0);
  const [bool, setbool] = useState(false);
  const [capacity, setcapacity] = useState(null);
  const [value, setValue] = useState('notpaid');

  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => setIsOpen(false);
  const {rono, flno} = route.params;
  var uid = auth().currentUser.uid;
  var Availablebeds = capacity - countofbeds;

  useEffect(() => {
    noofbeds();
  }, [bedsdata]);

  const noofbeds = async () => {
    const data = await firestore()
      .collection('users')
      .doc(uid)
      .collection('Floors')
      .doc(`${flno}`)
      .get();
    const arr = Object.keys(data._data[rono]);
    if (arr.length > 0) {
      setcapacity(parseInt(data._data[rono].capacity));
      setCountofbeds(arr.length - 2);
      setbedsdata(
        arr.filter(data => {
          if (data != 'availablebeds' && data != 'capacity') return data;
        }),
      );
    } else {
      setbedsdata(arr);
      setCountofbeds(0);
    }

    setbool(true);
  };

  const addbed = () => {
    bedno = `b${countofbeds + 1}`;
    var usersUpdate = {};
    usersUpdate[`${rono}.${bedno}`] = {
      Name: name,
      address: address,
      age: age,
      Amountpaid: amountpaid,
      Amounttype: value,
    };
    usersUpdate[`${rono}.availablebeds`] = Availablebeds - 1;
    firestore()
      .collection('users')
      .doc(uid)
      .collection('Floors')
      .doc(`${flno}`)
      .update(usersUpdate);
  };

  const sett = async pa => {
    console.log('btrigger');
    const data = await firestore()
      .collection('users')
      .doc(uid)
      .collection('Floors')
      .doc(`${flno}`)
      .get();

    console.log(pa);
    let sedata = data._data[rono][pa];
    console.log(sedata);
    setDisname(sedata['Name']);
    setDisamounttype(sedata['Amounttype']);
    setAmountpaid(sedata['Amountpaid']);
  };

  return (
    <>
      <ScrollView>
        <Box margin="10px" alignItems="center">
          <Heading>{`Available beds  ${Availablebeds}`}</Heading>
        </Box>
        <Box alignItems="flex-end" margin="5">
          <Button onPress={() => setShowModal(true)}>Add Bed</Button>
        </Box>
        <AlertDialog isOpen={isOpen} onClose={onClose}>
          <AlertDialog.Content>
            <AlertDialog.CloseButton />
            <AlertDialog.Header>Bed Details</AlertDialog.Header>
            <AlertDialog.Body>
              <Text fontSize="md"> Name: {disname}</Text>
              <Text fontSize="md"> Amounttype: {disamounttype}</Text>
              <Text fontSize="md"> Amountpaid: {disamountpaid}</Text>
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
        {bool && (
          <Box alignItems="center" margin="10px">
            {bedsdata.map((da, index) => (
              <Box key={index} margin="5px" width="50%">
                <Pressable
                  onPress={() => {
                    sett(da);
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
                <Input onChangeText={e => setAge(e)} />
              </FormControl>
              <FormControl mt="3">
                <FormControl.Label>amount paid</FormControl.Label>
                <Input onChangeText={e => setAmountpaid(e)} />
              </FormControl>
              <Radio.Group
                margin="10px"
                name="myRadioGroup"
                accessibilityLabel="amount type"
                value={value}
                onChange={nextValue => {
                  setValue(nextValue);
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
