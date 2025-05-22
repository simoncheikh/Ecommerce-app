import { StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

const styles = StyleSheet.create({
    container: {
        height: 200,
        width: '100%',
        borderRadius: 12,
        overflow: 'hidden',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

export const GoogleMaps = ({ longitude, latitude }: { longitude: number; latitude: number }) => (
    <View style={styles.container}>
        <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={{
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
            }}
        >
            <Marker
                coordinate={{
                    latitude: latitude,
                    longitude: longitude,
                }}
                title="Product Location"
                description="This is where the product is located"
            />
        </MapView>
    </View>
);
