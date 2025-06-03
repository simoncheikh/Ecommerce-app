import React, { useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, MapPressEvent, Region } from 'react-native-maps';
import { SafeAreaView } from "react-native-safe-area-context";


type MapScreenProps = {
    route: {
        params: {
            latitude: number;
            longitude: number;
            formData?: any;
            source?: string;
        };
    };
    navigation: any;
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
    searchContainer: {
        position: 'absolute',
        top: 10,
        width: '100%',
        paddingHorizontal: 10,
    },
});

export const MapScreen = ({ route, navigation }: MapScreenProps) => {
    const initialCoords = {
        latitude: route.params?.latitude || 33.5401,
        longitude: route.params?.longitude || 33.8342,
    };
    const [selectedLocation, setSelectedLocation] = useState(initialCoords);
    const mapRef = React.useRef<MapView>(null);

    const handleMapPress = (event: MapPressEvent) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setSelectedLocation({ latitude, longitude });
    };

    console.log(route.params?.source,route.params?.formData)

    const handleDone = () => {
        navigation.navigate({
            name: 'HomeTabs',
            params: {
                screen: route.params?.source === 'EditProduct' ? 'EditProduct' : 'AddProduct',
                params: {
                    selectedLatitude: selectedLocation.latitude,
                    selectedLongitude: selectedLocation.longitude,
                    formData: route.params?.formData,
                }
            },
            merge: true
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                    latitude: initialCoords.latitude,
                    longitude: initialCoords.longitude,
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
        </SafeAreaView>
    );
};