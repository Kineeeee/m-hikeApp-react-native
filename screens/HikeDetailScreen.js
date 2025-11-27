import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { deleteHike } from '../Database';

const HikeDetailScreen = ({ route, navigation }) => {
    const { hike } = route.params;

    const handleDelete = () => {
        Alert.alert(
            "Delete Hike",
            "Are you sure you want to delete this hike?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        await deleteHike(hike.id);
                        navigation.goBack();
                    }
                }
            ]
        );
    };

    const handleEdit = () => {
        navigation.navigate('AddHike', { hikeToEdit: hike });
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>{hike.name}</Text>

                <View style={styles.row}>
                    <Text style={styles.label}>Location:</Text>
                    <Text style={styles.value}>{hike.location}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Date:</Text>
                    <Text style={styles.value}>{hike.date}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Parking:</Text>
                    <Text style={styles.value}>{hike.parking}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Length:</Text>
                    <Text style={styles.value}>{hike.length}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Difficulty:</Text>
                    <Text style={styles.value}>{hike.difficulty}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Description:</Text>
                    <Text style={styles.text}>{hike.description || 'N/A'}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Weather Forecast:</Text>
                    <Text style={styles.text}>{hike.weather || 'N/A'}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Recommended Gear:</Text>
                    <Text style={styles.text}>{hike.gear || 'N/A'}</Text>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                    <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        elevation: 3,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 8,
    },
    section: {
        marginBottom: 15,
    },
    label: {
        fontWeight: 'bold',
        width: 100,
        color: '#555',
        fontSize: 16,
    },
    value: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    text: {
        fontSize: 16,
        color: '#333',
        marginTop: 5,
        lineHeight: 22,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 30,
    },
    editButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 25,
        elevation: 5,
    },
    deleteButton: {
        backgroundColor: '#ff4444',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 25,
        elevation: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default HikeDetailScreen;
