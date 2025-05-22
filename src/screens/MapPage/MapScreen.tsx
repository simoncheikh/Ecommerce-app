import React, { useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, MapPressEvent } from 'react-native-maps';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type AddProductParams = {
    selectedLatitude: number;
    selectedLongitude: number;
    formData?: any;
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    buttonContainer: {
        padding: 10,
        backgroundColor: '#fff',
    },
});

export const MapScreen = ({ route, navigation }: any) => {

    const [selectedLocation, setSelectedLocation] = useState({
        latitude: route.params.latitude,
        longitude: route.params.longitude,
    });

    const handleMapPress = (event: MapPressEvent) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setSelectedLocation({ latitude, longitude });
    };

    console.log(route.params?.source)

const handleDone = () => {
    const params = {
        selectedLatitude: selectedLocation.latitude,
        selectedLongitude: selectedLocation.longitude,
        formData: route.params?.formData, 
    };

    if (route.params?.source === 'EditProduct') {
        navigation.navigate({
            name: 'HomeTabs',
            params: {
                screen: 'EditProduct',
                params: params
            },
            merge: true 
        });
    } else {
        navigation.navigate({
            name: 'HomeTabs',
            params: {
                screen: 'AddProduct',
                params: params
            },
            merge: true
        });
    }
};

    return (
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                    latitude: route.params.latitude,
                    longitude: route.params.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
                onPress={handleMapPress}
            >
                <Marker
                    coordinate={selectedLocation}
                    title="Selected Location"
                    description="You selected this place"
                />
            </MapView>

            <View style={styles.buttonContainer}>
                <Button title="Done" onPress={handleDone} />
            </View>
        </View>
    );
};
