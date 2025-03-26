import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Dots = () => {
  // State to store details
  const [details, setDetails] = useState({
    name: 'Default Name',
    image: null,
    noOfActiveUsers: 0
  });

  // State to manage edit mode
  const [isEditing, setIsEditing] = useState(false);

  // Load details from AsyncStorage when component mounts
  useEffect(() => {
    loadDetails();
  }, []);

  // Save details to AsyncStorage
  const saveDetails = async (updatedDetails) => {
    try {
      await AsyncStorage.setItem('dotsDetails', JSON.stringify(updatedDetails));
      setDetails(updatedDetails);
    } catch (error) {
      Alert.alert('Error', 'Failed to save details');
    }
  };

  // Load details from AsyncStorage
  const loadDetails = async () => {
    try {
      const savedDetails = await AsyncStorage.getItem('dotsDetails');
      if (savedDetails) {
        setDetails(JSON.parse(savedDetails));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load details');
    }
  };

  // Function to pick an image from device library
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const updatedDetails = {
        ...details,
        image: result.assets[0].uri
      };
      saveDetails(updatedDetails);
    }
  };

  // Function to update details
  const handleUpdateDetails = (key, value) => {
    const updatedDetails = {
      ...details,
      [key]: key === 'noOfActiveUsers' ? Number(value) : value
    };
    saveDetails(updatedDetails);
  };

  // Function to handle saving details
  const handleSave = () => {
    setIsEditing(false);
  };

  // Function to reset details
  const handleReset = async () => {
    try {
      await AsyncStorage.removeItem('dotsDetails');
      setDetails({
        name: 'Default Name',
        image: null,
        noOfActiveUsers: 0
      });
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to reset details');
    }
  };

  // Render view mode
  const renderViewMode = () => (
    <View style={styles.container}>
      {details.image && (
        <Image 
          source={{ uri: details.image }} 
          style={styles.image} 
        />
      )}
      <Text style={styles.text}>Name: {details.name}</Text>
      <Text style={styles.text}>
        Active Users: {details.noOfActiveUsers}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={() => setIsEditing(true)}
        >
          <Text style={styles.editButtonText}>Edit Details</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.resetButton} 
          onPress={handleReset}
        >
          <Text style={styles.editButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render edit mode
  const renderEditMode = () => (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        {details.image ? (
          <Image 
            source={{ uri: details.image }} 
            style={styles.image} 
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text>Pick an Image</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        value={details.name}
        onChangeText={(text) => handleUpdateDetails('name', text)}
        placeholder="Enter Name"
      />

      <TextInput
        style={styles.input}
        value={details.noOfActiveUsers.toString()}
        onChangeText={(text) => handleUpdateDetails('noOfActiveUsers', text)}
        placeholder="Number of Active Users"
        keyboardType="numeric"
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={() => setIsEditing(false)}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {isEditing ? renderEditMode() : renderViewMode()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  text: {
    fontSize: 18,
    marginBottom: 10
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  editButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    flex: 1,
    marginRight: 10
  },
  resetButton: {
    backgroundColor: '#6c757d',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    flex: 1
  },
  editButtonText: {
    color: 'white',
    textAlign: 'center'
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
    flex: 1
  },
  buttonText: {
    color: 'white',
    textAlign: 'center'
  }
});

export default Dots;