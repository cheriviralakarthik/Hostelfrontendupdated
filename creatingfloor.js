import React, {useEffect, useState} from 'react';
import database from '@react-native-firebase/database';
import {Button, Box, HStack, Pressable, Heading, Text} from 'native-base';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';

const Floor = ({navigation}) => {
  const [floordata, setFloordata] = useState([]);
  const [bool, setbool] = useState(false);
  const [countoffloor, setcountoffloor] = useState(0);
  var uid = auth().currentUser.uid;

  useEffect(() => {
    nooffloors();
  }, [floordata]);

  const nooffloors = async () => {
    var arr = [];
    await firestore()
      .collection('users')
      .doc(uid)
      .collection('Floors')
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          arr.push(doc.id);
        });
        setFloordata(arr);
        setcountoffloor(arr.length);
        setbool(true);
      });
  };

  const addfloor = () => {
    console.log(countoffloor);
    firestore()
      .collection('users')
      .doc(uid)
      .collection('Floors')
      .doc(`Floor  ${countoffloor + 1}`)
      .set({});
  };

  return (
    <ScrollView>
      <Box alignItems="flex-end" margin="10px">
        <Button
          variant="solid"
          colorScheme="secondary"
          onPress={() => addfloor()}>
          Add Floor
        </Button>
      </Box>
      {bool && (
        <Box alignItems="center" margin="10px">
          {floordata.map((da, index) => (
            <Box key={index} margin="5px" width="50%">
              <Pressable
                onPress={() => navigation.navigate('Room', {floorid: da})}
                rounded="8"
                overflow="hidden"
                borderWidth="1"
                borderColor="coolGray.300"
                maxW="96"
                shadow="3"
                bg="coolGray.100"
                p="5">
                <Box key={index} justifyContent="center" alignItems="center">
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

export default Floor;
