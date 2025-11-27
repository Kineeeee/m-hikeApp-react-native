# MyFirstApp (M-hike)

Welcome to the M-hike application! This is a React Native application built with Expo, designed to help hikers manage their hike details.

## Features

-   **Hike Management**: Add, view, edit, and delete hike details.
-   **Data Persistence**: Uses SQLite to store hike data locally on the device.
-   **Navigation**: Smooth navigation between screens using React Navigation.
-   **Date Picker**: Integrated calendar for selecting hike dates.
-   **Difficulty Levels**: Selectable difficulty levels for hikes.

## Prerequisites

Before you begin, ensure you have the following installed:

-   [Node.js](https://nodejs.org/) (LTS version recommended)
-   [npm](https://www.npmjs.com/) (usually comes with Node.js) or [Yarn](https://yarnpkg.com/)
-   [Expo Go](https://expo.dev/client) app on your Android or iOS device (for physical device testing)

## Installation

1.  **Clone the repository** (if applicable) or navigate to the project directory:
    ```bash
    cd MyFirstApp
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```
    or if you use Yarn:
    ```bash
    yarn install
    ```

## Running the Application

To start the development server, run:

```bash
npm start
```
or
```bash
npx expo start
```

This will start the Metro Bundler. You can then run the app on different platforms:

### Android
-   **Physical Device**: Open the Expo Go app on your Android phone and scan the QR code displayed in the terminal.
-   **Emulator**: Ensure you have an Android Emulator running (via Android Studio), then press `a` in the terminal.
    ```bash
    npm run android
    ```

### iOS
-   **Physical Device**: Open the Camera app on your iPhone/iPad and scan the QR code (requires Expo Go).
-   **Simulator**: Ensure you have Xcode installed and a Simulator running, then press `i` in the terminal.
    ```bash
    npm run ios
    ```

### Web
-   To run the app in a web browser, press `w` in the terminal.
    ```bash
    npm run web
    ```

## Project Structure

-   **`App.js`**: The main entry point of the application. Sets up navigation and the main layout.
-   **`Database.js`**: Handles all SQLite database operations (init, add, update, delete, fetch).
-   **`screens/`**: Contains the individual screens of the app (e.g., Home, Add Hike, Hike Details).
-   **`assets/`**: Stores images and other static assets.
-   **`app.json`**: Configuration file for Expo.

## Troubleshooting

-   **Database Issues**: If you encounter issues with data not showing up, try resetting the database (if a reset button is implemented) or reinstalling the app on the simulator/device to clear the local SQLite file.
-   **Dependency Errors**: If you see errors related to missing modules, try deleting `node_modules` and running `npm install` again.

## Technologies Used

-   [React Native](https://reactnative.dev/)
-   [Expo](https://expo.dev/)
-   [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
-   [React Navigation](https://reactnavigation.org/)
