import { useCallback, useEffect, useRef, useState } from "react";
import {
    Linking,
    Pressable,
    StyleSheet,
    Text,
    View,
    ViewStyle,
    Platform,
} from "react-native";
import {
    Camera,
    useCameraDevice,
    useCameraPermission,
    PhotoFile,
    CameraPosition,
} from "react-native-vision-camera";

type CameraVisionProps = {
    onClose: () => void;
    onPhotoTaken: (uri: string) => void;
    visible: boolean;
};

export const CameraVision = ({
    onClose,
    onPhotoTaken,
    visible,
}: CameraVisionProps) => {
    const camera = useRef<Camera>(null);
    const { hasPermission, requestPermission } = useCameraPermission();
    const device = useCameraDevice("front");
    const [isCameraInitialized, setIsCameraInitialized] = useState(false);
    

    const handleCameraPermission = useCallback(async () => {
        if (!hasPermission) {
            await requestPermission();
        }
    }, [hasPermission, requestPermission]);

    useEffect(() => {
        handleCameraPermission();
    }, [handleCameraPermission]);

    const takePhoto = async () => {
        if (!camera.current) return;

        try {
            const photo = await camera.current.takePhoto({
                flash: 'off',
                skipMetadata: false, // Keep EXIF data
                enableAutoStabilization: true,
                // For front camera mirroring
                mirrorFrontCamera: device?.position === 'front',
            });

            if (!photo?.path) {
                console.warn("No photo path returned");
                return;
            }

            // Proper URI format for both platforms
            const photoUri = Platform.OS === "android" ? `file://${photo.path}` : photo.path;

            // Pass the raw URI - let the display component handle orientation
            onPhotoTaken(photoUri);
            onClose();
        } catch (error) {
            console.error("Failed to capture photo:", error);
        }
    };

    if (!visible) return null;

    if (!hasPermission) {
        return (
            <Text>
                Camera permission not granted.{" "}
                <Text style={{ color: "blue" }} onPress={() => Linking.openSettings()}>
                    Open Settings
                </Text>
            </Text>
        );
    }

    if (!device) return <Text>No camera detected</Text>;

    const captureButtonStyle: ViewStyle = {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "white",
        position: "absolute",
        bottom: 30,
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
    };

    return (
        <View style={StyleSheet.absoluteFill}>
            <Camera
                ref={camera}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={visible}
                photo={true}
                pixelFormat="yuv"
                onInitialized={() => setIsCameraInitialized(true)}
                onError={(error) => console.error("Camera error:", error)}
            />
            <View style={captureButtonStyle}>
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