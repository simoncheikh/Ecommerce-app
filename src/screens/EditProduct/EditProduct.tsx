import {
    Alert,
    BackHandler,
    Image,
    Modal,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import { launchImageLibrary } from "react-native-image-picker";
import { PERMISSIONS, request, RESULTS } from "react-native-permissions";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Button } from "../../components/atoms/Button/Button";
import { Textfield } from "../../components/atoms/Textfield/Textfield";
import { CameraVision } from "../../components/molecules/Camera/cameraVision";
import { useAuthStore } from "../../store/sessionStore/AuthStore";
import { styles } from "./EditProduct.styles";
import { GoogleMaps } from "../../components/organisms/Maps/googleMaps";
import { AddProductApi } from "../../api/products/addProduct/AddProductApi";
import { GetProductApi } from "../../api/products/getProductById/GetProductApi";
import { API_BASE_URL } from "../../constants/apiConfig";
import { EditProductApi } from "../../api/products/editProduct/EditProductApi";
import { useCameraStore } from "../../store/cameraStore/CameraStore";
import { GlobalStyles } from "../../styles/GobalStyles";
import { useThemeStore } from "../../store/themeStore/ThemeStore";

const schema = z.object({
    title: z.string().min(2, { message: "Title must be at least 2 characters long" }),
    description: z.string().min(2, { message: "Description must be at least 2 characters long" }),
    price: z.string().nonempty({ message: "Price must be a number greater than 0" }),
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

export const EditProduct = ({ navigation, route }: any) => {
    const isCameraOpen = useCameraStore((state) => state.isCameraOpen)
    const theme = useThemeStore((state) => state.theme)
    const setIsCameraOpen = useCameraStore((state) => state.setCameraOpen);
    const { token } = useAuthStore();
    // const [cameraOpen, setCameraOpen] = useState(false);
    const [imageIndex, setImageIndex] = useState<number | null>(null);
    const [showPhotoOptions, setShowPhotoOptions] = useState(false);
    const [photoActionIndex, setPhotoActionIndex] = useState<number | null>(null);

    const isDarkMode = theme == 'dark'


    const darkTheme = GlobalStyles.theme.darkTheme
    const lightTheme = GlobalStyles.theme.lightTheme

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
        defaultValues: {
            title: "",
            description: "",
            price: "",
            images: [],
            location: {
                name: "",
                latitude: 0,
                longitude: 0,
            },
        },
    });

    const selectedLatitude = route.params?.selectedLatitude;
    const selectedLongitude = route.params?.selectedLongitude;
    const productId = route.params?.productId;

    const { data: productData, isLoading } = useQuery({
        queryKey: ["product", productId],
        queryFn: () => GetProductApi(token?.data?.accessToken, productId),
        enabled: !!token?.data?.accessToken && !!productId,
    });

    useEffect(() => {
        if (productData) {
            const currentFormValues = getValues();
            const hasLocationChanged =
                selectedLatitude && selectedLongitude &&
                (currentFormValues.location.latitude !== selectedLatitude ||
                    currentFormValues.location.longitude !== selectedLongitude);

            if (!hasLocationChanged) {
                reset({
                    title: productData.title || "",
                    description: productData.description || "",
                    price: productData.price?.toString() || "",
                    images: productData.images?.map((img: any) => `${API_BASE_URL}${img.url}`) || [],
                    location: {
                        name: productData.location?.name || currentFormValues.location.name,
                        latitude: productData.location?.latitude || currentFormValues.location.latitude,
                        longitude: productData.location?.longitude || currentFormValues.location.longitude,
                    },
                });
            }
        }
    }, [productData, reset, selectedLatitude, selectedLongitude]);


    useEffect(() => {
        if (selectedLatitude && selectedLongitude) {
            setValue(
                "location",
                {
                    ...getValues("location"),
                    latitude: selectedLatitude,
                    longitude: selectedLongitude,
                },
                { shouldValidate: true }
            );
        }
    }, [selectedLatitude, selectedLongitude]);

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
            source: "EditProduct"
        });
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (route.params?.selectedLatitude && route.params?.selectedLongitude) {
                setValue("location.latitude", route.params.selectedLatitude);
                setValue("location.longitude", route.params.selectedLongitude);
            }
            if (route.params?.formData) {
                reset(route.params.formData);
            }
        });

        return unsubscribe;
    }, [navigation, route.params]);

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
        if (Platform.OS === "ios") {
            permissionResult = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
        } else {
            permissionResult = await request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
        }

        if (permissionResult !== RESULTS.GRANTED) {
            Alert.alert("Permission Denied", "You need to allow access to your photos.");
            return;
        }

        const result = await launchImageLibrary({
            mediaType: "photo",
            quality: 1,
            maxWidth: 1024,
            maxHeight: 1024,
        });

        if (result.didCancel || !result.assets?.length) return;

        const uri = result.assets[0].uri;
        if (!uri) return;

        const currentImages = getValues("images");
        const newImages =
            index !== null
                ? [...currentImages.slice(0, index), uri, ...currentImages.slice(index + 1)]
                : [...currentImages, uri];

        setValue("images", newImages, { shouldValidate: true });
    };

    const editProductMutation = useMutation({
        mutationFn: (data: any) => EditProductApi(data),
        onSuccess: () => {
            Alert.alert("Success", "Product updated successfully");
            navigation.goBack();
        },
        onError: (error: any) => {
            console.error("Edit Error:", error);
            Alert.alert("Error", error.message || "An error occurred.");
        },
    });

    const handleEditProduct = (data: FormData) => {
        if (!token?.data?.accessToken) {
            Alert.alert("Error", "You need to be logged in");
            return;
        }

        if (!data.location.latitude || !data.location.longitude) {
            Alert.alert("Error", "Please select a location");
            return;
        }

        const mappedImages = data.images.map((uri) => {
            const uriPath = uri.includes(API_BASE_URL)
                ? uri.replace(API_BASE_URL, '')
                : uri;

            const existing = productData.images?.find((img: any) =>
                img.url === uriPath || `${API_BASE_URL}${img.url}` === uri
            );

            return existing
                ? { url: existing.url, _id: existing._id }
                : { url: uri };
        });

        editProductMutation.mutate({
            id: productData._id,
            title: data.title,
            description: data.description,
            price: Number(data.price),
            location: {
                name: data.location.name,
                longitude: data.location.longitude,
                latitude: data.location.latitude,
            },
            images: mappedImages,
            accessToken: token.data.accessToken,
        });
    };

    return (
        <SafeAreaView
            style={[
                styles.container,
                { backgroundColor: isDarkMode ? darkTheme.backgroundColor : lightTheme.backgroundColor },
            ]}
        >
            <ScrollView
                style={{ backgroundColor: isDarkMode ? darkTheme.backgroundColor : lightTheme.backgroundColor }}
            >
                <View
                    style={[
                        styles.formCard,
                        { backgroundColor: isDarkMode ? darkTheme.backgroundColor : lightTheme.backgroundColor },
                    ]}
                >
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: isDarkMode ? darkTheme.color : lightTheme.color }]}>
                            Title
                        </Text>
                        <Textfield control={control} name="title" placeholder="Enter Title" />
                        {errors.title && (
                            <Text style={[styles.error, { color: 'red' }]}>{errors.title.message}</Text>
                        )}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: isDarkMode ? darkTheme.color : lightTheme.color }]}>
                            Description
                        </Text>
                        <Textfield control={control} name="description" placeholder="Enter Description" />
                        {errors.description && (
                            <Text style={[styles.error, { color: 'red' }]}>{errors.description.message}</Text>
                        )}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: isDarkMode ? darkTheme.color : lightTheme.color }]}>
                            Price
                        </Text>
                        <Textfield control={control} name="price" placeholder="Enter Price" />
                        {errors.price && (
                            <Text style={[styles.error, { color: 'red' }]}>{errors.price.message}</Text>
                        )}
                    </View>

                    <Text style={[styles.label, { color: isDarkMode ? darkTheme.color : lightTheme.color }]}>
                        Add Location
                    </Text>
                    <Textfield control={control} name="location.name" placeholder="Location Name" />

                    <Pressable onPress={handleNavigation} style={styles.mapContainer}>
                        <GoogleMaps
                            longitude={getValues('location').longitude}
                            latitude={getValues('location').latitude}
                        />
                    </Pressable>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: isDarkMode ? darkTheme.color : lightTheme.color }]}>
                            Product Images
                        </Text>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            {getValues('images').map((uri, index) => (
                                <View key={index} style={{ position: 'relative' }}>
                                    <Image source={{ uri }} style={{ width: 100, height: 100, borderRadius: 8 }} />
                                    <TouchableOpacity
                                        style={{ position: 'absolute', top: -8, right: -8 }}
                                        onPress={() => handleRemovePhoto(index)}
                                    >
                                        <Text
                                            style={{
                                                backgroundColor: 'red',
                                                color: 'white',
                                                padding: 4,
                                                borderRadius: 12,
                                            }}
                                        >
                                            ✕
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => showPhotoSelection(index)}
                                        style={{
                                            backgroundColor: 'rgba(0,0,0,0.5)',
                                            padding: 4,
                                            borderRadius: 4,
                                            marginTop: 4,
                                        }}
                                    >
                                        <Text style={{ fontSize: 12, color: 'white', textAlign: 'center' }}>Change</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                            {getValues('images').length < 2 && (
                                <TouchableOpacity
                                    onPress={() => showPhotoSelection(null)}
                                    style={{
                                        width: 100,
                                        height: 100,
                                        backgroundColor: isDarkMode ? darkTheme.backgroundColor : '#eee',
                                        borderRadius: 8,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Text style={{ fontSize: 24, color: isDarkMode ? darkTheme.color : '#000' }}>＋</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        {errors.images && (
                            <Text style={[styles.error, { color: 'red' }]}>{errors.images.message}</Text>
                        )}
                    </View>
                </View>

                <Modal
                    visible={showPhotoOptions}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setShowPhotoOptions(false)}
                >
                    <View
                        style={[
                            styles.modalOverlay,
                            { backgroundColor: (isDarkMode ? darkTheme.backgroundColor : lightTheme.backgroundColor) + 'aa' },
                        ]}
                    >
                        <View
                            style={[
                                styles.modalContainer,
                                { backgroundColor: isDarkMode ? darkTheme.backgroundColor : lightTheme.backgroundColor },
                            ]}
                        >
                            <Text style={[styles.modalTitle, { color: isDarkMode ? darkTheme.color : lightTheme.color }]}>
                                Add Photo
                            </Text>
                            <TouchableOpacity style={styles.modalOption} onPress={() => handleTakePhoto(photoActionIndex)}>
                                <Text style={[styles.modalOptionText, { color: isDarkMode ? darkTheme.color : lightTheme.color }]}>
                                    Take Photo
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalOption} onPress={() => handleChooseFromLibrary(photoActionIndex)}>
                                <Text style={[styles.modalOptionText, { color: isDarkMode ? darkTheme.color : lightTheme.color }]}>
                                    Choose from Library
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalCancel} onPress={() => setShowPhotoOptions(false)}>
                                <Text style={[styles.modalCancelText, { color: isDarkMode ? darkTheme.color : lightTheme.color }]}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <View style={styles.buttonWrapper}>
                    <Button
                        label={editProductMutation.isPending ? 'Product is updating' : "Save Changes"}
                        variant="primary"
                        disabled={!isValid || editProductMutation.isPending}
                        onClick={handleSubmit(handleEditProduct)}
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
