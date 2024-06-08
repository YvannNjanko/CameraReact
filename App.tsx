/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import { PermissionStatus,AndroidPermission, check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import RNFS from 'react-native-fs';

import React, {useRef} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  useColorScheme,
  View,
  StyleSheet,
  Button as NativeButton,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import {Camera, useCameraDevice} from 'react-native-vision-camera';

const requestCameraPermissions = async () => {
  const newCameraPermission = await Camera.requestCameraPermission();
  console.log(newCameraPermission);
};

const requestPermissionFs = async () => {
  const result = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
  
  if (result === RESULTS.GRANTED) {
    console.log('Permission accordée');
  } else {
    console.log('Permission refusée');
  }
};
const checkStoragePermissions =async()=>{
  const result =  await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
  if (result === RESULTS.GRANTED) {
    console.log('yo')
  } else {
    requestPermissionFs();
  }
}


const savePhoto = async (photoPath:any) => {
  const newPath = `${RNFS.PicturesDirectoryPath}/photo_${Date.now()}.jpg`;

  try {
    await RNFS.copyFile(photoPath, newPath);
    Alert.alert('Photo enregistrée dans la galerie', newPath);
  } catch (e) {
    console.error('Erreur lors de l\'enregistrement de la photo : ', e);
  }
};


function App(): React.JSX.Element {
  const camera = useRef<Camera>(null);

  const cameraPermission = Camera.getCameraPermissionStatus();
  if (cameraPermission === 'denied') {
    requestCameraPermissions();
  }
  
  const device = useCameraDevice('front');
  if (device == null) {
    return (
      <View>
        <Text>Something went wrong</Text>
      </View>
    );
  }
  checkStoragePermissions();
  return (
    <View style={styles.absoluteFill}>
      <Camera
        ref={camera}
        style={styles.absoluteFill}
        device={device}
        photo={true}
        isActive={true}
      />

      {/* Position button absolutely on top */}
      <View style={styles.buttonContainer}>
        <NativeButton
          title="Capture"
          onPress={async() => {
            if (camera.current !== null) {
              const photo = await camera.current.takePhoto();
              savePhoto(photo.path);
            }
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  absoluteFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20, // Adjust position as needed
    right: 20, // Adjust position as needed
  },
});

export default App;
