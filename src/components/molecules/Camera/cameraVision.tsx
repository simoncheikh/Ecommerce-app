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
import { SafeAreaView } from "react-native-safe-area-context";
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
    const frontDevice = useCameraDevice('front');
    const backDevice = useCameraDevice('back');

    const [isCameraInitialized, setIsCameraInitialized] = useState(false);
    const [currentCameraPosition, setCurrentCameraPosition] = useState<CameraPosition>('front');

    const device = currentCameraPosition === 'front' ? frontDevice : backDevice;

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
                skipMetadata: false,
                enableAutoStabilization: true,
                mirrorFrontCamera: device?.position === 'front',
            });

            if (!photo?.path) {
                console.warn("No photo path returned");
                return;
            }

            const photoUri = Platform.OS === "android" ? `file://${photo.path}` : photo.path;

            onPhotoTaken(photoUri);
            onClose();
        } catch (error) {
            console.error("Failed to capture photo:", error);
        }
    };

    const toggleCamera = () => {
        setCurrentCameraPosition(prev => prev === 'front' ? 'back' : 'front');
    };

    if (!visible) return null;

    if (!hasPermission) {
        return (
            <Text testID="capture-button">
                Camera permission not granted.<Text style={{ color: "blue" }} onPress={() => Linking.openSettings()}>
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
        <SafeAreaView style={StyleSheet.absoluteFill} testID="mock-camera">
            <Camera
                ref={camera}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={visible}
                photo={true}
                pixelFormat="yuv"
                onInitialized={() => setIsCameraInitialized(true)}
                onError={(error) => console.error("Camera error:", error)}
                testID="mock-camera"
            />
            <View style={{ position: "absolute", top: 50, left: 20 }}>
                <Pressable onPress={toggleCamera}>
                    <Text style={{ color: "white", fontSize: 18 }}>
                        Switch to {currentCameraPosition === "front" ? "Back" : "Front"} Camera
                    </Text>
                </Pressable>
            </View>
            <View style={captureButtonStyle}>
                <Pressable
                    testID="capture-button"
                    onPress={takePhoto}
                    style={{
                        height: 80,
                        width: 80,
                        borderRadius: 40,
                        backgroundColor: "red",
                    }}
                />
            </View>
        </SafeAreaView>
    );
};
