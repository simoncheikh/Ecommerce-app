import { Alert, BackHandler, Image, Modal, PermissionsAndroid, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { PERMISSIONS, request, RESULTS } from "react-native-permissions";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../../components/atoms/Button/Button";
import { Textfield } from "../../components/atoms/Textfield/Textfield";
import { CameraVision } from "../../components/molecules/Camera/cameraVision";
import { useAuthStore } from "../../store/sessionStore/AuthStore";
import { styles } from "./AddProduct.styles"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { API_BASE_URL } from "../../constants/apiConfig";
import { z } from "zod";
import { GlobalStyles } from "../../styles/GobalStyles";
import { GoogleMaps } from "../../components/organisms/Maps/googleMaps";
import { AddProductApi } from "../../api/products/addProduct/AddProductApi";
import { useMutation } from "@tanstack/react-query";
import { useCameraStore } from "../../store/cameraStore/CameraStore";
import { useThemeStore } from "../../store/themeStore/ThemeStore";



const schema = z.object({
    title: z.string().min(2, { message: "Title must be at least 2 characters long" }),
    description: z.string().min(2, { message: "Description must be at least 2 characters long" }),
    price: z
        .string().min(2, { message: "Price must be a number greater than 0" }),

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
    const { token } = useAuthStore();
    const theme = useThemeStore((state) => state.theme)
    const isCameraOpen = useCameraStore((state) => state.isCameraOpen)
    const setIsCameraOpen = useCameraStore((state) => state.setCameraOpen);
    const [imageIndex, setImageIndex] = useState<number | null>(null);
    const [showPhotoOptions, setShowPhotoOptions] = useState(false);
    const [photoActionIndex, setPhotoActionIndex] = useState<number | null>(null);

    const isDarkMode = theme == 'dark'

    const darkTheme = GlobalStyles.theme.darkTheme
    const lightTheme = GlobalStyles.theme.lightTheme


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
            price: 0,
            images: [],
            location: {
                name: "",
                latitude: selectedLatitude || 0,
                longitude: selectedLongitude || 0,
            },
        },
    });

    useEffect(() => {
        if (route.params?.selectedLatitude && route.params?.selectedLongitude) {
            setValue("location", {
                ...getValues("location"),
                latitude: route.params.selectedLatitude,
                longitude: route.params.selectedLongitude,
            }, { shouldValidate: true });
        }
    }, [route.params?.selectedLatitude, route.params?.selectedLongitude]);


    useEffect(() => {
        const backAction = () => {
            if (isCameraOpen) {
                setIsCameraOpen(false);
                return true;
            }
            return false;
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => backHandler.remove();
    }, [isCameraOpen]);



    const handlePhotoTaken = (uri: string) => {
        const currentImages = getValues("images");
        const newImages =
            imageIndex !== null
                ? [...currentImages.slice(0, imageIndex), uri, ...currentImages.slice(imageIndex + 1)]
                : [...currentImages, uri];

        setValue("images", newImages, { shouldValidate: true });
        setIsCameraOpen(false);
    };


    const handleRemovePhoto = (index: number) => {
        const currentImages = getValues("images");
        const updated = currentImages.filter((_, i) => i !== index);
        setValue("images", updated, { shouldValidate: true });
    };

    const handleNavigation = () => {
        navigation.navigate("Map", {
            latitude: getValues("location").latitude || 33.5401,
            longitude: getValues("location").longitude || 33.8342,
            formData: getValues(),
            source: 'AddProduct'
        });
    };

    const showPhotoSelection = (index: number | null = null) => {
        setPhotoActionIndex(index);
        setShowPhotoOptions(true);
    };

    const handleTakePhoto = (index: number | null = null) => {
        setImageIndex(index);
        setIsCameraOpen(true);
        setShowPhotoOptions(false);
    };

    const handleChooseFromLibrary = async (index: number | null = null) => {
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
    };

    const mutation = useMutation({
        mutationFn: AddProductApi,
        onSuccess: () => {
            Alert.alert("Success", "Product added successfully");
            reset();
            navigation.goBack();
        },
        onError: (error: any) => {
            Alert.alert("Error", error.message || "Failed to add product");
        },
    });

    const handleAddProduct = (data: FormData) => {
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
    };



    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? darkTheme.backgroundColor : lightTheme.backgroundColor }]}>
            <ScrollView style={{ backgroundColor: isDarkMode ? darkTheme.backgroundColor : lightTheme.backgroundColor }}>
                <View style={[styles.formCard, { backgroundColor: isDarkMode ? darkTheme.backgroundColor : lightTheme.backgroundColor }]}>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: isDarkMode ? darkTheme.color : lightTheme.color }]}>Title</Text>
                        <Textfield control={control} name="title" placeholder="Enter Title" />
                        {errors.title && <Text style={[styles.error, { color: 'red' }]}>{errors.title.message}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: isDarkMode ? darkTheme.color : lightTheme.color }]}>Description</Text>
                        <Textfield control={control} name="description" placeholder="Enter Description" />
                        {errors.description && <Text style={[styles.error, { color: 'red' }]}>{errors.description.message}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: isDarkMode ? darkTheme.color : lightTheme.color }]}>Price</Text>
                        <Textfield control={control} name="price" placeholder="Enter Price" type="numeric" />
                        {errors.price && <Text style={[styles.error, { color: 'red' }]}>{errors.price.message}</Text>}
                    </View>

                    <Text style={[styles.label, { color: isDarkMode ? darkTheme.color : lightTheme.color }]}>Add Location</Text>
                    <Textfield control={control} name="location.name" placeholder="Location Name" />

                    <Pressable onPress={handleNavigation} style={styles.mapContainer}>
                        <GoogleMaps
                            longitude={getValues('location.longitude')}
                            latitude={getValues('location.latitude')}
                        />
                    </Pressable>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: isDarkMode ? darkTheme.color : lightTheme.color }]}>Product Images</Text>
                        <View style={styles.ImagesContainer}>
                            {control._formValues.images.map((uri, index) => (
                                <View key={index} style={{ position: "relative" }}>
                                    <Image source={{ uri }} style={styles.profileImage} />
                                    <TouchableOpacity style={styles.removeImage} onPress={() => handleRemovePhoto(index)}>
                                        <Text style={[styles.removeText, { color: isDarkMode ? darkTheme.color : lightTheme.color }]}>✕</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => showPhotoSelection(index)} style={styles.changeProfileImage}>
                                        <Text style={[styles.changeText, { color: isDarkMode ? darkTheme.color : lightTheme.color }]}>Change</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}

                            {control._formValues.images.length < 2 && (
                                <TouchableOpacity onPress={() => showPhotoSelection(null)} style={styles.addProfileImage}>
                                    <Text style={{ fontSize: 24, color: isDarkMode ? darkTheme.color : lightTheme.color }}>＋</Text>
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
                    <View style={[styles.modalOverlay, { backgroundColor: (isDarkMode ? darkTheme.backgroundColor : lightTheme.backgroundColor) + 'aa' }]}>
                        <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? darkTheme.backgroundColor : lightTheme.backgroundColor }]}>
                            <Text style={[styles.modalTitle, { color: isDarkMode ? darkTheme.color : lightTheme.color }]}>Add Photo</Text>

                            <TouchableOpacity style={styles.modalOption} onPress={() => handleTakePhoto(photoActionIndex)}>
                                <Text style={[styles.modalOptionText, { color: isDarkMode ? darkTheme.color : lightTheme.color }]}>Take Photo</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.modalOption} onPress={() => handleChooseFromLibrary(photoActionIndex)}>
                                <Text style={[styles.modalOptionText, { color: isDarkMode ? darkTheme.color : lightTheme.color }]}>Choose from Library</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.modalCancel} onPress={() => setShowPhotoOptions(false)}>
                                <Text style={[styles.modalCancelText, { color: isDarkMode ? darkTheme.color : lightTheme.color }]}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <View style={styles.buttonWrapper}>
                    <Button
                        label={mutation.isPending ? "Creating Product..." : "Submit"}
                        variant="primary"
                        disabled={!isValid}
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

    )
}