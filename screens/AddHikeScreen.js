import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    Alert,
    Modal,
    Platform,
    FlatList,
    ActivityIndicator
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { addHike, updateHike } from '../Database';

const AddHikeScreen = ({ navigation, route }) => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [parking, setParking] = useState(false);
    const [length, setLength] = useState('');
    const [difficulty, setDifficulty] = useState('Easy');
    const [description, setDescription] = useState('');
    const [weather, setWeather] = useState('');
    const [gear, setGear] = useState('');

    const [modalVisible, setModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [hikeId, setHikeId] = useState(null);

    // Location Search State
    const [locationModalVisible, setLocationModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loadingLocation, setLoadingLocation] = useState(false);

    useEffect(() => {
        if (route.params?.hikeToEdit) {
            const { hikeToEdit } = route.params;
            setName(hikeToEdit.name);
            setLocation(hikeToEdit.location);
            // Parse date string back to Date object if needed, or handle string date from DB
            // Assuming DB stores as string DD/MM/YYYY, I might need logic to parse it back to Date object for the picker
            // For simplicity, if it's a valid date string, I try to parse it, else default to now.
            // In a real app, consistent storage format (ISO) is recommended.
            // Here I just set it if it's a string, but the picker needs a Date object.
            // Let's try to parse "DD/MM/YYYY" to Date
            if (hikeToEdit.date) {
                const parts = hikeToEdit.date.split('/');
                if (parts.length === 3) {
                    const dt = new Date(parts[2], parts[1] - 1, parts[0]);
                    setDate(dt);
                }
            }

            setParking(hikeToEdit.parking === 'Yes');
            setLength(hikeToEdit.length);
            setDifficulty(hikeToEdit.difficulty);
            setDescription(hikeToEdit.description);
            setWeather(hikeToEdit.weather);
            setGear(hikeToEdit.gear);
            setHikeId(hikeToEdit.id);
            setIsEditing(true);
            navigation.setOptions({ title: 'Edit Hike' });
        }
    }, [route.params]);

    const validateAndSubmit = () => {
        if (!name || !location || !length || !difficulty) {
            Alert.alert('Error', 'Please fill in all required fields (*).');
            return;
        }
        setModalVisible(true);
    };

    const handleConfirm = async () => {
        try {
            if (isEditing) {
                await updateHike(
                    hikeId,
                    name,
                    location,
                    date.toLocaleDateString('en-GB'), // Store as DD/MM/YYYY
                    parking ? 'Yes' : 'No',
                    length,
                    difficulty,
                    description,
                    weather,
                    gear
                );
                Alert.alert('Success', 'Hike updated successfully!', [
                    {
                        text: 'OK', onPress: () => {
                            setModalVisible(false);
                            navigation.navigate('Home'); // Go back to Home to refresh list or just goBack
                        }
                    }
                ]);
            } else {
                await addHike(
                    name,
                    location,
                    date.toLocaleDateString('en-GB'), // Store as DD/MM/YYYY
                    parking ? 'Yes' : 'No',
                    length,
                    difficulty,
                    description,
                    weather,
                    gear
                );
                Alert.alert('Success', 'Hike added successfully!', [
                    {
                        text: 'OK', onPress: () => {
                            setModalVisible(false);
                            navigation.goBack();
                        }
                    }
                ]);
            }
        } catch (error) {
            setModalVisible(false);
            Alert.alert('Error', 'Failed to save hike.');
        }
    };

    const searchLocation = async () => {
        if (!searchQuery.trim()) return;
        setLoadingLocation(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&addressdetails=1&limit=5`, {
                headers: {
                    'User-Agent': 'MyFirstApp/1.0'
                }
            });
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Location search error:', error);
            Alert.alert('Error', 'Failed to search location');
        } finally {
            setLoadingLocation(false);
        }
    };

    const selectLocation = (item) => {
        setLocation(item.display_name);
        setLocationModalVisible(false);
        setSearchQuery('');
        setSearchResults([]);
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.label}>Name of Hike *</Text>
                <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g. Blue Mountain" />

                <Text style={styles.label}>Location *</Text>
                <View style={styles.locationRow}>
                    <TextInput style={[styles.input, styles.locationInput]} value={location} onChangeText={setLocation} placeholder="e.g. Sydney" />
                    <TouchableOpacity style={styles.searchButton} onPress={() => setLocationModalVisible(true)}>
                        <Text style={styles.searchButtonText}>Search</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Date of Hike *</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
                    <Text>{date.toLocaleDateString('en-GB')}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowDatePicker(false);
                            if (selectedDate) {
                                setDate(selectedDate);
                            }
                        }}
                    />
                )}

                <View style={styles.row}>
                    <Text style={styles.label}>Parking Available *</Text>
                    <View style={styles.switchContainer}>
                        <Text>{parking ? 'Yes' : 'No'}</Text>
                        <Switch value={parking} onValueChange={setParking} />
                    </View>
                </View>

                <Text style={styles.label}>Length of Hike *</Text>
                <TextInput
                    style={styles.input}
                    value={length}
                    onChangeText={(text) => {
                        const valid = text.replace(/[^0-9.]/g, '');
                        const parts = valid.split('.');
                        setLength(parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : valid);
                    }}
                    placeholder="e.g. 5km"
                    keyboardType="numericDecimal"
                />

                <Text style={styles.label}>Difficulty Level *</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={difficulty}
                        onValueChange={(itemValue) => setDifficulty(itemValue)}
                    >
                        <Picker.Item label="Easy" value="Easy" />
                        <Picker.Item label="Moderate" value="Moderate" />
                        <Picker.Item label="Difficult" value="Difficult" />
                    </Picker>
                </View>

                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={4}
                    placeholder="Optional description"
                />

                <Text style={styles.label}>Weather Forecast (Optional)</Text>
                <TextInput style={styles.input} value={weather} onChangeText={setWeather} placeholder="e.g. Sunny, 25°C" />

                <Text style={styles.label}>Recommended Gear (Optional)</Text>
                <TextInput style={styles.input} value={gear} onChangeText={setGear} placeholder="e.g. Hiking boots, Raincoat" />

                <TouchableOpacity style={styles.saveButton} onPress={validateAndSubmit}>
                    <Text style={styles.saveButtonText}>{isEditing ? 'Update Hike' : 'Next'}</Text>
                </TouchableOpacity>
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Confirm Details</Text>
                        <ScrollView style={styles.modalScroll}>
                            <Text style={styles.modalText}><Text style={styles.bold}>Name:</Text> {name}</Text>
                            <Text style={styles.modalText}><Text style={styles.bold}>Location:</Text> {location}</Text>
                            <Text style={styles.modalText}><Text style={styles.bold}>Date:</Text> {date.toLocaleDateString('en-GB')}</Text>
                            <Text style={styles.modalText}><Text style={styles.bold}>Parking:</Text> {parking ? 'Yes' : 'No'}</Text>
                            <Text style={styles.modalText}><Text style={styles.bold}>Length:</Text> {length}</Text>
                            <Text style={styles.modalText}><Text style={styles.bold}>Difficulty:</Text> {difficulty}</Text>
                            <Text style={styles.modalText}><Text style={styles.bold}>Description:</Text> {description || 'N/A'}</Text>
                            <Text style={styles.modalText}><Text style={styles.bold}>Weather:</Text> {weather || 'N/A'}</Text>
                            <Text style={styles.modalText}><Text style={styles.bold}>Gear:</Text> {gear || 'N/A'}</Text>
                        </ScrollView>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                                <Text style={styles.buttonText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={handleConfirm}>
                                <Text style={styles.buttonText}>{isEditing ? 'Update' : 'Save'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Location Search Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={locationModalVisible}
                onRequestClose={() => setLocationModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Search Location</Text>
                        <View style={styles.searchRow}>
                            <TextInput
                                style={[styles.input, styles.searchInput]}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholder="Enter city or place"
                            />
                            <TouchableOpacity style={styles.searchActionButton} onPress={searchLocation}>
                                <Text style={styles.buttonText}>Go</Text>
                            </TouchableOpacity>
                        </View>

                        {loadingLocation ? (
                            <ActivityIndicator size="large" color="#2196F3" />
                        ) : (
                            <FlatList
                                data={searchResults}
                                keyExtractor={(item) => item.place_id.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity style={styles.resultItem} onPress={() => selectLocation(item)}>
                                        <Text>{item.display_name}</Text>
                                    </TouchableOpacity>
                                )}
                                style={styles.resultsList}
                            />
                        )}

                        <TouchableOpacity style={[styles.modalButton, styles.cancelButton, { marginTop: 10 }]} onPress={() => setLocationModalVisible(false)}>
                            <Text style={styles.buttonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
        // Picker height might need adjustment on Android vs iOS
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    saveButton: {
        backgroundColor: '#2196F3',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '90%',
        maxHeight: '80%',
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    modalScroll: {
        marginBottom: 20,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 8,
    },
    bold: {
        fontWeight: 'bold',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#999',
    },
    confirmButton: {
        backgroundColor: '#4CAF50',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    locationRow: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    },
    locationInput: {
        flex: 1,
        marginBottom: 15,
    },
    searchButton: {
        backgroundColor: '#FF9800',
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
        justifyContent: 'center',
    },
    searchButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    searchRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 10,
    },
    searchInput: {
        flex: 1,
        marginBottom: 0,
    },
    searchActionButton: {
        backgroundColor: '#2196F3',
        padding: 12,
        borderRadius: 8,
        justifyContent: 'center',
    },
    resultItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    resultsList: {
        maxHeight: 200,
        width: '100%',
    },
});

export default AddHikeScreen;
