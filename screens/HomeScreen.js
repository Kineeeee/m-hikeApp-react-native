import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getHikes, deleteAllHikes } from '../Database';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

const HomeScreen = ({ navigation }) => {
    const [hikes, setHikes] = useState([]);

    const loadHikes = async () => {
        const data = await getHikes();
        setHikes(data);
    };

    useFocusEffect(
        useCallback(() => {
            loadHikes();
        }, [])
    );

    const handleDeleteAll = () => {
        Alert.alert(
            "Delete All Hikes",
            "Are you sure you want to delete all hikes? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        await deleteAllHikes();
                        loadHikes();
                    }
                }
            ]
        );
    };

    const exportDb = async () => {
        try {
            // Check if the file exists in the standard SQLite directory
            const dbName = 'hikes.db';
            const dbUri = FileSystem.documentDirectory + 'SQLite/' + dbName;

            const fileInfo = await FileSystem.getInfoAsync(dbUri);

            if (!fileInfo.exists) {
                // Try looking in the root document directory just in case
                const rootDbUri = FileSystem.documentDirectory + dbName;
                const rootFileInfo = await FileSystem.getInfoAsync(rootDbUri);

                if (rootFileInfo.exists) {
                    await Sharing.shareAsync(rootDbUri);
                    return;
                }

                Alert.alert("Error", "Database file not found at: " + dbUri);
                return;
            }

            await Sharing.shareAsync(dbUri);
        } catch (error) {
            Alert.alert("Error", "Could not share database: " + error.message);
        }
    };

    const renderHikeItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('HikeDetail', { hike: item })}
        >
            <View style={styles.cardHeader}>
                <Text style={styles.hikeName}>{item.name}</Text>
                <Text style={styles.hikeDate}>{item.date}</Text>
            </View>
            <Text style={styles.hikeLocation}>{item.location}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={hikes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderHikeItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={<Text style={styles.emptyText}>No hikes found. Add one!</Text>}
            />

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.deleteAllButton} onPress={handleDeleteAll}>
                    <Text style={styles.deleteAllText}>Delete All</Text>
                </TouchableOpacity>

                {/* <TouchableOpacity style={styles.exportButton} onPress={exportDb}>
                    <Text style={styles.exportText}>Export DB</Text>
                </TouchableOpacity> */}

                <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddHike')}>
                    <Text style={styles.addButtonText}>+ Add Hike</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    listContent: {
        paddingBottom: 100, // Increased padding to accommodate buttons
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    hikeName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    hikeDate: {
        fontSize: 14,
        color: '#666',
    },
    hikeLocation: {
        fontSize: 16,
        color: '#555',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#888',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 16,
        right: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    deleteAllButton: {
        backgroundColor: '#ff4444',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 25,
        elevation: 5,
    },
    deleteAllText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    exportButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 25,
        elevation: 5,
    },
    exportText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    addButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        elevation: 5,
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default HomeScreen;
