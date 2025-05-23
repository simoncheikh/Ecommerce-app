import React, { useState } from 'react';
import { View, StyleSheet, Button, SafeAreaView, PermissionsAndroid, Platform, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, MapPressEvent, Region } from 'react-native-maps';
import { useNavigation, useRoute } from '@react-navigation/native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geolocation from 'react-native-geolocation-service';


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
        width: '100%',
        paddingHorizontal: 10,
        zIndex: 1,
    },

});

export const MapScreen = ({ route, navigation }: MapScreenProps) => {
    const initialCoords = {
        latitude: route.params?.latitude || 33.5401,
        longitude: route.params?.longitude || 33.8342,
    };
    const [isFocused, setIsFocused] = useState(false)
    const [address, setAddress] = useState('')
    const [selectedLocation, setSelectedLocation] = useState(initialCoords);
    const mapRef = React.useRef<MapView>(null);

    const handleMapPress = (event: MapPressEvent) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setSelectedLocation({ latitude, longitude });
    };
    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                ]);
                if (
                    granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED &&
                    granted['android.permission.ACCESS_COARSE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
                ) {
                    return true;
                } else {
                    Alert.alert('Permission Denied', 'Location permission is required.');
                    return false;
                }
            } catch (err) {
                Alert.alert('Permission Error', 'Failed to request permission');
                return false;
            }
        }
        return true;
    };

    const handleCurrentLocation = async () => {
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
            Alert.alert('Permission denied', 'Location permission is required.');
            return;
        }
        console.log('Permission granted, getting location...');

        Geolocation.getCurrentPosition(
            (position) => {
                if (!position || !position.coords) {
                    Alert.alert("Error", "Could not get your location.");
                    return;
                }

                const coords = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };

                setSelectedLocation(coords);
                mapRef.current?.animateToRegion({
                    ...coords,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                });
            },
            (error) => {
                console.error('Location error:', error);
                Alert.alert('Error getting location', error.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 10000,
                forceRequestLocation: true,
            }
        );
    };


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
            <View style={styles.searchContainer}>
                <GooglePlacesAutocomplete
                    placeholder="Search"
                    fetchDetails={true}
                    onPress={(data, details = null) => {
                        setAddress(details?.formatted_address || '');
                        const location = details?.geometry?.location;
                        if (location) {
                            const coords = {
                                latitude: location.lat,
                                longitude: location.lng,
                            };
                            setSelectedLocation(coords);
                            mapRef.current?.animateToRegion({
                                ...coords,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            });
                        }
                    }}
                    query={{
                        key: 'AIzaSyAyO6i-7TkHArTix8XvdH-7uOLTEktUEjQ',
                        language: 'en',
                        type: '(cities)'
                    }}
                    textInputProps={{
                        onFocus: () => setIsFocused(true),
                        onBlur: () => setIsFocused(false),
                    }}
                    debounce={200}
                    styles={{
                        container: {},
                        textInputContainer: {
                            backgroundColor: '#fff',
                            borderTopWidth: 0,
                            borderBottomWidth: 0,
                        },
                        textInput: {
                            height: 44,
                            color: '#000',
                            fontSize: 16,
                            backgroundColor: '#f0f0f0',
                            borderRadius: 5,
                            paddingHorizontal: 10,
                        },
                    }}
                    predefinedPlaces={[]}
                />
            </View>


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
                <Button title="Current Location" onPress={handleCurrentLocation} />
                <View style={{ height: 10 }} />
                <Button title="Done" onPress={handleDone} />
            </View>
        </SafeAreaView>
    );
};