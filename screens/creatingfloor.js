import React, {useEffect, useState, useContext} from 'react';
import {Button, Box, HStack, Pressable, Heading, Text} from 'native-base';

import {store} from '../App';
import axios from 'axios';
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
  const [data, setData] = useContext(store);

  //calling the function to get the floors when the component mounts
  useEffect(() => {
    nooffloors();
  }, []);

  //api call to get floors
  const nooffloors = async () => {
    try {
      const datatosend = {
        id: data.id,
      };

      //api call to getfloors route using 10.0.2.2 as ip because emulator will point the these ip to localhost
      const responce = await axios.post(
        'http://10.0.2.2:4000/getfloors',
        datatosend,
      );
      if (responce.status == 200) {
        console.log(responce.data);

        //setting the data to state to render it
        setFloordata(responce.data);
        //setting the bool to true to render the data
        setbool(true);
        //setting the count of floors
        setcountoffloor(responce.data.length);
      } else {
        console.log('error in getting floors');
      }
    } catch (error) {
      console.log(error);
    }
  };

  //api call to add floor
  const addfloor = async () => {
    try {
      const datatosend = {
        id: data.id,
        floorno: countoffloor + 1,
      };

      //api call to addfloor route using 10.0.2.2 as ip because emulator will point the these ip to localhost
      const responce = await axios.post(
        'http://10.0.2.2:4000/addfloor',
        datatosend,
      );
      if (responce.status == 200) {
        console.log(responce.data);
        //calling the function to get the floors again to render the added  floor
        nooffloors();
      } else {
        console.log('error add floor');
      }
    } catch (error) {
      console.log(error);
    }
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
                onPress={
                  //passing the floor number to the next screen
                  () => navigation.navigate('Room', {floorno: da})
                }
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
