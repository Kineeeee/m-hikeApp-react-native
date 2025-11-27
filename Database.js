import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('hikes.db');

export const initDB = async () => {
    try {
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS hikes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        date TEXT NOT NULL,
        parking TEXT NOT NULL,
        length TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        description TEXT,
        weather TEXT,
        gear TEXT
      );
    `);
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

export const addHike = async (name, location, date, parking, length, difficulty, description, weather, gear) => {
    try {
        const result = await db.runAsync(
            'INSERT INTO hikes (name, location, date, parking, length, difficulty, description, weather, gear) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name, location, date, parking, length, difficulty, description, weather, gear]
        );
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error adding hike:', error);
        throw error;
    }
};

export const getHikes = async () => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM hikes');
        return allRows;
    } catch (error) {
        console.error('Error getting hikes:', error);
        return [];
    }
};

export const updateHike = async (id, name, location, date, parking, length, difficulty, description, weather, gear) => {
    try {
        await db.runAsync(
            'UPDATE hikes SET name = ?, location = ?, date = ?, parking = ?, length = ?, difficulty = ?, description = ?, weather = ?, gear = ? WHERE id = ?',
            [name, location, date, parking, length, difficulty, description, weather, gear, id]
        );
    } catch (error) {
        console.error('Error updating hike:', error);
        throw error;
    }
};

export const deleteHike = async (id) => {
    try {
        await db.runAsync('DELETE FROM hikes WHERE id = ?', [id]);
    } catch (error) {
        console.error('Error deleting hike:', error);
        throw error;
    }
};

export const deleteAllHikes = async () => {
    try {
        await db.runAsync('DELETE FROM hikes');
    } catch (error) {
        console.error('Error deleting all hikes:', error);
        throw error;
    }
};
