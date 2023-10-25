import {useState, useContext} from 'react';
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
  Spinner,
} from 'native-base';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
} from 'react-native';
import {store} from '../App';

const Signup = () => {
  const [spinner, setSpinner] = useState(false);
  const [photo, setPhoto] = useState([]);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmpassword, setConfirmpassword] = useState(null);
  const [city, setCity] = useState(null);
  const [area, setArea] = useState(null);
  const [pincode, setPincode] = useState(null);
  const [hostelname, setHostelname] = useState(null);
  const [pricestarts, setPricestarts] = useState(null);
  const [data, setData] = useContext(store);

  var formData = new FormData();
  for (let i = 0; i < photo.length; i++) {
    formData.append('image', {
      name: new Date() + '_profile',
      uri: photo[i],
      type: 'image/jpg',
    });
  }

  const handleimage = async () => {
    const result = await launchImageLibrary({selectionLimit: 10});

    for (let i = 0; i < result.assets.length; i++) {
      console.log(result.assets[i].uri);
      setPhoto(photos => [...photos, result.assets[i].uri]);
    }
  };
  const validatesignup = async () => {
    try {
      setSpinner(true);
      // checking the validation
      if (
        email.length < 6 ||
        password.length < 6 ||
        city.length < 2 ||
        area.length < 2 ||
        pincode.length < 2 ||
        hostelname.length < 2 ||
        pricestarts.length < 2 ||
        photo.length == 0
      ) {
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
        city: city,
        area: area,
        pincode: pincode,
        hostelname: hostelname,
        pricestarts: pricestarts,
      };

      //api call to register route using 10.0.2.2 as ip because emulator will point the these ip to localhost
      const responce = await axios.post(
        'http://65.2.141.48:4000/register',
        datatosend,
      );
      console.log(responce.data.id);
      var id = responce.data.id;
      if (responce.status == 201) {
        formData.append('userid', id);
        const responseofimage = await axios.post(
          'http://65.2.141.48:4000/uploadamenities',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        if (responseofimage.status == 200) {
          console.log('image uploaded');
          setData(responce.data);
        }
      } else {
        console.log('error in sign in');
      }
    } catch (error) {
      console.log(error, 'error in signup');
    }
  };

  return (
    <ScrollView>
      <>
        {spinner ? (
          <VStack
            color="emerald.500"
            justifyContent="center"
            alignItems="center"
            mt="30   ">
            <Spinner size="lg" />
          </VStack>
        ) : (
          <Box
            alignItems="center"
            mt="10"
            ml="auto"
            mr="auto"
            borderRadius="lg"
            shadow="6"
            shadowColor="gray.800"
            justifyContent="center"
            backgroundColor="white">
            <VStack margin="10px" space={3} justifyContent="center">
              <Input
                placeholder="Email"
                w="60%"
                onChangeText={e => setEmail(e)}
              />
              <Input
                placeholder="Password"
                w="60%"
                type="password"
                onChangeText={e => setPassword(e)}
              />
              <Input
                placeholder="Confirm Password"
                w="60%"
                type="password"
                onChangeText={e => setConfirmpassword(e)}
              />
              <Input
                placeholder="city"
                w="60%"
                onChangeText={e => setCity(e)}
              />
              <Input
                placeholder="area"
                w="60%"
                onChangeText={e => setArea(e)}
              />
              <Input
                placeholder="pincode"
                w="60%"
                onChangeText={e => setPincode(e)}
              />
              <Input
                placeholder="hostel name"
                w="60%"
                onChangeText={e => setHostelname(e)}
              />
              <Input
                placeholder="price starts"
                w="60%"
                onChangeText={e => setPricestarts(e)}
              />
              <Button onPress={handleimage}> upload Photos</Button>
              {photo && (
                <HStack space="3">
                  {photo.map((photo, index) => (
                    <Image
                      key={index}
                      source={{uri: photo}}
                      style={{width: 50, height: 50}}
                    />
                  ))}
                </HStack>
              )}

              <Button
                size="sm"
                mt="4"
                variant="outline"
                colorScheme="green"
                onPress={() => validatesignup()}>
                Signup
              </Button>
            </VStack>
          </Box>
        )}
      </>
    </ScrollView>
  );
};

export default Signup;
