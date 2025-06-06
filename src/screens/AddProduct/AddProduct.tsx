import { Alert, BackHandler, Image, Modal, Platform, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { PERMISSIONS, request, RESULTS } from "react-native-permissions";
import { useCallback, useEffect, useState, useMemo } from "react";
import { Button } from "../../components/atoms/Button/Button";
import { Textfield } from "../../components/atoms/Textfield/Textfield";
import { CameraVision } from "../../components/molecules/Camera/cameraVision";
import { useAuthStore } from "../../store/sessionStore/AuthStore";
import { styles } from "./AddProduct.styles"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GlobalStyles } from "../../styles/GobalStyles";
import { GoogleMaps } from "../../components/organisms/Maps/googleMaps";
import { AddProductApi } from "../../api/products/addProduct/AddProductApi";
import { useMutation } from "@tanstack/react-query";
import { useCameraStore } from "../../store/cameraStore/CameraStore";
import { useThemeStore } from "../../store/themeStore/ThemeStore";
import { sendPushNotification } from "../../utils/PushNotification";
import { SafeAreaView } from "react-native-safe-area-context";

const schema = z.object({
    title: z.string().min(2, { message: "Title must be at least 2 characters long" }),
    description: z.string().min(2, { message: "Description must be at least 2 characters long" }),
    price: z
        .string()
        .refine((val) => !isNaN(Number(val)), {
            message: "Price must be a valid number",
        })
        .refine((val) => Number(val) > 0, {
            message: "Price must be greater than 0",
        }),
    images: z
        .array(z.string().nonempty("Invalid image"))
        .max(2, "You can upload up to 2 images")
        .min(1, "At least 1 image is required"),
    location: z.object({
        name: z.string().min(2, "Location name must be at least 2 characters"),
        latitude: z.number(),
        longitude: z.number(),
    }),
});

type FormData = z.infer<typeof schema>;

export const AddProduct = ({ navigation, route }: any) => {
    const token = useAuthStore((state) => state.token);
    const theme = useThemeStore((state) => state.theme);
    const isCameraOpen = useCameraStore((state) => state.isCameraOpen);
    const setIsCameraOpen = useCameraStore((state) => state.setCameraOpen);
    const [imageIndex, setImageIndex] = useState<number | null>(null);
    const [showPhotoOptions, setShowPhotoOptions] = useState(false);
    const [photoActionIndex, setPhotoActionIndex] = useState<number | null>(null);
    const [showFullMap, setShowFullMap] = useState(false);

    const isDarkMode = theme === 'dark';
    const isLoggedIn = !!token;

    const { darkTheme, lightTheme } = GlobalStyles.theme;
    const currentTheme = isDarkMode ? darkTheme : lightTheme;

    const selectedLatitude = route.params?.selectedLatitude;
    const selectedLongitude = route.params?.selectedLongitude;

    const {
        control,
        handleSubmit,
        setValue,
        getValues,
        reset,
        formState: { errors, isValid },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: route?.params?.formData || {
            title: "",
            description: "",
            price: "",
            images: [],
            location: {
                name: "",
                latitude: selectedLatitude || 0,
                longitude: selectedLongitude || 0,
            },
        },
    });

    const formValues = useMemo(() => control._formValues, [control._formValues]);

    const handleBackAction = useCallback(() => {
        if (isCameraOpen) {
            setIsCameraOpen(false);
            return true;
        }
        return false;
    }, [isCameraOpen]);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener("hardwareBackPress", handleBackAction);
        return () => backHandler.remove();
    }, [handleBackAction]);

    const handlePhotoTaken = useCallback((uri: string) => {
        const currentImages = getValues("images");
        const newImages =
            imageIndex !== null
                ? [...currentImages.slice(0, imageIndex), uri, ...currentImages.slice(imageIndex + 1)]
                : [...currentImages, uri];

        setValue("images", newImages, { shouldValidate: true });
        setIsCameraOpen(false);
    }, [imageIndex, getValues, setValue]);

    const handleRemovePhoto = useCallback((index: number) => {
        const currentImages = getValues("images");
        const updated = currentImages.filter((_, i) => i !== index);
        setValue("images", updated, { shouldValidate: true });
    }, [getValues, setValue]);

    // const handleNavigation = useCallback(() => {
    //     navigation.navigate("Map", {
    //         latitude: getValues("location").latitude || 33.5401,
    //         longitude: getValues("location").longitude || 33.8342,
    //         formData: getValues(),
    //         source: 'AddProduct'
    //     });
    // }, [getValues, navigation]);

    const showPhotoSelection = useCallback((index: number | null = null) => {
        setPhotoActionIndex(index);
        setShowPhotoOptions(true);
    }, []);

    const handleTakePhoto = useCallback((index: number | null = null) => {
        setImageIndex(index);
        setIsCameraOpen(true);
        setShowPhotoOptions(false);
    }, []);

    const handleChooseFromLibrary = useCallback(async (index: number | null = null) => {
        setShowPhotoOptions(false);

        let permissionResult;
        if (Platform.OS === 'ios') {
            permissionResult = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
        } else {
            permissionResult = await request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
        }

        if (permissionResult !== RESULTS.GRANTED) {
            Alert.alert("Permission Denied", "You need to allow access to your photos to upload images.");
            return;
        }

        const result = await launchImageLibrary({
            mediaType: 'photo',
            quality: 1,
            maxWidth: 1024,
            maxHeight: 1024,
        });

        if (result.didCancel || !result.assets || result.assets.length === 0) return;

        const uri = result.assets[0].uri;
        if (!uri) return;

        const currentImages = getValues("images");
        const newImages =
            index !== null
                ? [...currentImages.slice(0, index), uri, ...currentImages.slice(index + 1)]
                : [...currentImages, uri];

        setValue("images", newImages, { shouldValidate: true });
    }, [getValues, setValue]);

    const mutation = useMutation({
        mutationFn: AddProductApi,
        onSuccess: (response) => {
            reset({
                title: "",
                description: "",
                price: "",
                images: [],
                location: {
                    name: "",
                    latitude: 0,
                    longitude: 0,
                },
            });
            Alert.alert("Success", "Product added successfully");
            sendPushNotification(response?.data?._id ?? "default-id", response?.data.title ?? "New Product");
            navigation.setParams({
                selectedLatitude: undefined,
                selectedLongitude: undefined,
                formData: undefined,
            });
            navigation.navigate('Home');
        },
        onError: (error: any) => {
            Alert.alert("Error", error.message || "Failed to add product");
            console.error("Error", error.message || "Failed to add product");

        },
    });

    const handleAddProduct = useCallback((data: FormData) => {
        if (!token?.data?.accessToken) {
            Alert.alert("Error", "You need to be logged in to add products");
            return;
        }

        if (!data.location.latitude || !data.location.longitude) {
            Alert.alert("Error", "Please select a valid location");
            return;
        }

        mutation.mutate({
            title: data.title,
            description: data.description,
            price: Number(data.price),
            location: {
                name: data.location.name || "",
                longitude: data.location.longitude,
                latitude: data.location.latitude,
            },
            images: data.images.map(uri => ({ url: uri, _id: "" })),
            accessToken: token.data.accessToken,
        });
    }, [mutation, token]);


    if (!isLoggedIn || !token?.data?.accessToken) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <Text style={{ color: "red", fontSize: 16 }}>You must be logged in to view products.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.backgroundColor }]}>
            <ScrollView style={{ backgroundColor: currentTheme.backgroundColor }}>
                <View style={[styles.formCard, { backgroundColor: currentTheme.backgroundColor }]}>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: currentTheme.color }]}>Title</Text>
                        <Textfield control={control} name="title" placeholder="Enter Title" />
                        {errors.title && <Text style={[styles.error, { color: 'red' }]}>{errors.title.message}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: currentTheme.color }]}>Description</Text>
                        <Textfield control={control} name="description" placeholder="Enter Description" />
                        {errors.description && <Text style={[styles.error, { color: 'red' }]}>{errors.description.message}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: currentTheme.color }]}>Price</Text>
                        <Textfield control={control} name="price" placeholder="Enter Price" type="numeric" />
                        {errors.price && <Text style={[styles.error, { color: 'red' }]}>{errors.price.message}</Text>}
                    </View>

                    <Text style={[styles.label, { color: currentTheme.color }]}>Add Location</Text>
                    <Textfield control={control} name="location.name" placeholder="Location Name" />

                    <Pressable onPress={() => setShowFullMap(true)} style={styles.mapContainer}>
                        <GoogleMaps
                            fullscreen
                            visible={showFullMap}
                            latitude={getValues("location.latitude") || 33.5401}
                            longitude={getValues("location.longitude") || 33.8342}
                            onClose={() => setShowFullMap(false)}
                            onLocationSelect={(lat, lng) => {
                                setValue("location.latitude", lat, { shouldValidate: true });
                                setValue("location.longitude", lng, { shouldValidate: true });
                            }}
                        />
                    </Pressable>


                    <View style={[styles.inputGroup, { backgroundColor: currentTheme.backgroundColor}]}>
                        <Text style={[styles.label, { color: currentTheme.color }]}>Product Images</Text>
                        <View style={[styles.ImagesContainer, { backgroundColor: isDarkMode ? darkTheme.backgroundColor : lightTheme.backgroundColor,borderColor:'black' }]}>
                            {formValues.images.map((uri: string, index: number) => (
                                <View key={index} style={{ position: "relative", backgroundColor: isDarkMode ? darkTheme.backgroundColor : lightTheme.backgroundColor }}>
                                    <Image source={{ uri }} style={styles.profileImage} />
                                    <TouchableOpacity style={[styles.removeImage, { backgroundColor: currentTheme.backgroundColor }]} onPress={() => handleRemovePhoto(index)}>
                                        <Text style={[styles.removeText, { color: currentTheme.color }]}>✕</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => showPhotoSelection(index)} style={styles.changeProfileImage}>
                                        <Text style={[styles.changeText, { color: currentTheme.color }]}>Change</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}

                            {formValues.images.length < 2 && (
                                <TouchableOpacity onPress={() => showPhotoSelection(null)} style={[styles.addProfileImage, { backgroundColor: currentTheme.backgroundColor }]}>
                                    <Text style={{ fontSize: 24, color: currentTheme.color }}>＋</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        {errors.images && <Text style={[styles.error, { color: 'red' }]}>{errors.images.message}</Text>}
                    </View>
                </View>

                <Modal
                    visible={showPhotoOptions}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setShowPhotoOptions(false)}
                >
                    <View style={[styles.modalOverlay, { backgroundColor: currentTheme.backgroundColor + 'aa' }]}>
                        <View style={[styles.modalContainer, { backgroundColor: currentTheme.backgroundColor }]}>
                            <Text style={[styles.modalTitle, { color: currentTheme.color }]}>Add Photo</Text>

                            <TouchableOpacity style={styles.modalOption} onPress={() => handleTakePhoto(photoActionIndex)}>
                                <Text style={[styles.modalOptionText, { color: currentTheme.color }]}>Take Photo</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.modalOption} onPress={() => handleChooseFromLibrary(photoActionIndex)}>
                                <Text style={[styles.modalOptionText, { color: currentTheme.color }]}>Choose from Library</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.modalCancel} onPress={() => setShowPhotoOptions(false)}>
                                <Text style={[styles.modalCancelText, { color: currentTheme.color }]}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <View style={styles.buttonWrapper}>
                    <Button
                        label={mutation.isPending ? "Creating Product..." : "Submit"}
                        variant="primary"
                        disabled={!isValid || mutation.isPending}
                        onClick={handleSubmit(handleAddProduct)}
                    />
                </View>
            </ScrollView>

            <CameraVision
                visible={isCameraOpen}
                onClose={() => setIsCameraOpen(false)}
                onPhotoTaken={handlePhotoTaken}
            />
        </SafeAreaView>
    );
};