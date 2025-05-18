// CameraVision.tsx

import { useCallback, useEffect, useRef, useState } from "react";
import {
    Linking,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import {
    Camera,
    useCameraDevice,
    useCameraPermission,
} from "react-native-vision-camera";

type CameraVisionProps = {
    onClose: () => void;
    onPhotoTaken: (uri: string) => void;
    visible: boolean;
};

export const CameraVision = ({ onClose, onPhotoTaken, visible }: CameraVisionProps) => {
    const camera = useRef<Camera>(null);
    const { hasPermission, requestPermission } = useCameraPermission();
    const device = useCameraDevice("front");

    const handleCameraPermission = useCallback(async () => {
        if (!hasPermission) {
            await requestPermission();
        }
    }, [hasPermission, requestPermission]);

    useEffect(() => {
        handleCameraPermission();
    }, [handleCameraPermission]);

    const takePhoto = async () => {
        const photo = await camera.current?.takePhoto();
        if (photo?.path) {
            onPhotoTaken(`file://${photo.path}`);
            onClose();
        }
    };

    if (!visible) return null;

    if (!hasPermission) {
        return (
            <Text>
                Camera permission not granted.
                <Text onPress={() => Linking.openSettings()}> Open Settings</Text>
            </Text>
        );
    }

    if (!device) return <Text>No camera detected</Text>;

    return (
        <View style={StyleSheet.absoluteFill}>
            <Camera
                ref={camera}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                photo
            />
            <View
                style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    backgroundColor: "white",
                    position: "absolute",
                    bottom: 30,
                    alignSelf: "center",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Pressable
                    onPress={takePhoto}
                    style={{
                        height: 80,
                        width: 80,
                        borderRadius: 40,
                        backgroundColor: "red",
                    }}
                />
            </View>
        </View>
    );
};
