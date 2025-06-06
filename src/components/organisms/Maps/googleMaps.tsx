import React from "react";
import { View, Modal, Pressable } from "react-native";
import MapView, { Marker, MapPressEvent, PROVIDER_GOOGLE } from "react-native-maps";
import { Button } from "../../atoms/Button/Button";

interface GoogleMapsProps {
    latitude: number;
    longitude: number;
    fullscreen?: boolean;
    visible?: boolean;
    onClose?: () => void;
    onLocationSelect?: (lat: number, lng: number) => void;
}

export const GoogleMaps = ({ latitude,
    longitude,
    fullscreen = false,
    visible = false,
    onClose,
    onLocationSelect, }: GoogleMapsProps) => {
    const [selectedLatLng, setSelectedLatLng] = React.useState({ latitude, longitude });

    if (fullscreen && visible) {
        return (
            <Modal visible animationType="slide">
                <View style={{ flex: 1 }}>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={{ flex: 1 }}
                        initialRegion={{
                            latitude,
                            longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                        onPress={(e: MapPressEvent) => {
                            const coords = e.nativeEvent.coordinate;
                            setSelectedLatLng(coords);
                        }}
                    >
                        <Marker coordinate={selectedLatLng} />
                    </MapView>
                    <View style={{ padding: 10 }}>
                        <Button
                            label="Done"
                            onClick={() => {
                                if (onLocationSelect) {
                                    onLocationSelect(selectedLatLng.latitude, selectedLatLng.longitude);
                                }
                                onClose?.();
                            }}
                            variant="primary"
                        />
                        <Button label="Cancel" variant="secondary" onClick={onClose} />
                    </View>
                </View>
            </Modal>
        );
    }

    return (
        <MapView
            provider={PROVIDER_GOOGLE}
            style={{ height: 150, borderRadius: 10 }}
            region={{
                latitude,
                longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }}
            pointerEvents="none"
        >
            <Marker coordinate={{ latitude, longitude }} />
        </MapView>
    );
};

