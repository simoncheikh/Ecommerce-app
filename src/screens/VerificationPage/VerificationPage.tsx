import React, { useEffect, useRef, useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    Alert,
    TouchableOpacity,
    Image,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../components/atoms/Button/Button";
import { styles } from "./VerificationPage.styles";
import { useAuthStore } from "../../store/sessionStore/AuthStore";
import { verificationApi } from "../../api/users/verification/verificationApi";
import { resendVerificationApi } from "../../api/users/verification/resendverificationApi";
import { useMutation } from "@tanstack/react-query";
import { useThemeStore } from "../../store/themeStore/ThemeStore";
import { GlobalStyles } from "../../styles/GobalStyles";

const codeSchema = z.object({
    code: z.array(z.string().length(1)).length(6),
});

type CodeForm = z.infer<typeof codeSchema>;

export const VerificationPage = ({ navigation, route }: any) => {
    const { login } = useAuthStore();
    const theme = useThemeStore((state) => state.theme)
    const isDarkMode = theme == 'dark'

    const darkTheme = GlobalStyles.theme.darkTheme
    const lightTheme = GlobalStyles.theme.lightTheme


    const { email } = route.params;

    const {
        control,
        handleSubmit,
        clearErrors,
        reset,
        formState: { isValid },
    } = useForm<CodeForm>({
        resolver: zodResolver(codeSchema),
        defaultValues: { code: ["", "", "", "", "", ""] },
    });

    const inputs = useRef<Array<TextInput | null>>([]);
    const [submitError, setSubmitError] = useState("");
    const [timer, setTimer] = useState(30);

    useEffect(() => {
        if (timer === 0) return;
        const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        return () => clearInterval(interval);
    }, [timer]);


    const verificationMutation = useMutation({
        mutationFn: (codeString: string) =>
            verificationApi({ email, otp: codeString }),
        onSuccess: (res) => {
            if (res?.success) {
                navigation.navigate("SignIn");
            } else {
                setSubmitError("Invalid verification code");
                reset({ code: ["", "", "", "", "", ""] });
                inputs.current[0]?.focus();
            }
        },
        onError: (error) => {
            console.error("Verification error:", error);
            Alert.alert("Error", "Something went wrong. Please try again.");
        },
    });


    const resendMutation = useMutation({
        mutationFn: () => resendVerificationApi(email),
        onSuccess: (res) => {
            setTimer(30);
            if (res.success) {
                Alert.alert("Success", res.message);
            } else {
                Alert.alert("Error", res.message);
            }
        },
        onError: (error) => {
            console.error("Resend error:", error);
            Alert.alert("Error", "Something went wrong while resending.");
        },
    });

    const onSubmit = (data: CodeForm) => {
        const codeString = data.code.join("");
        verificationMutation.mutate(codeString);
    };

    const handleVerificationCode = () => {
        resendMutation.mutate();
    };


    return (
        <SafeAreaView
            style={[
                styles.container,
                { backgroundColor: isDarkMode ? darkTheme.backgroundColor : lightTheme.backgroundColor },
            ]}
        >
            <Image source={require("../../assets/store.png")} />

            <View style={styles.titleContainer}>
                <Text
                    style={[
                        styles.title,
                        { color: isDarkMode ? darkTheme.color : lightTheme.color },
                    ]}
                >
                    Verification Code
                </Text>
                <Text
                    style={[
                        styles.subtitle,
                        { color: isDarkMode ? darkTheme.color : lightTheme.color },
                    ]}
                >
                    Enter the code sent to your email
                </Text>
            </View>

            <View style={styles.codeContainer}>
                <View style={styles.inputContainer}>
                    {Array.from({ length: 6 }).map((_, index) => (
                        <Controller
                            key={index}
                            control={control}
                            name={`code.${index}` as const}
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    ref={(ref) => (inputs.current[index] = ref)}
                                    style={[
                                        styles.input,
                                        {
                                            color: isDarkMode ? darkTheme.color : lightTheme.color,
                                            borderColor: isDarkMode ? darkTheme.color : lightTheme.color,
                                        },
                                    ]}
                                    keyboardType="number-pad"
                                    maxLength={1}
                                    value={value}
                                    onChangeText={(text) => {
                                        if (/^\d?$/.test(text)) {
                                            onChange(text);
                                            setSubmitError("");
                                            clearErrors("code");

                                            if (text && index < 5) {
                                                setTimeout(() => {
                                                    inputs.current[index + 1]?.focus();
                                                }, 50);
                                            } else if (!text && index > 0) {
                                                setTimeout(() => {
                                                    inputs.current[index - 1]?.focus();
                                                }, 50);
                                            }
                                        }
                                    }}
                                    textAlign="center"
                                />
                            )}
                        />
                    ))}
                </View>

                <Text
                    style={[
                        styles.errorText,
                        { color: submitError ? "red" : "transparent" },
                    ]}
                >
                    {submitError && "Code is wrong."}
                </Text>

                <View style={styles.button}>
                    <Button
                        label={verificationMutation.isPending ? "Verifying..." : submitError || "Submit"}
                        onClick={handleSubmit(onSubmit)}
                        variant="primary"
                        disabled={!isValid || verificationMutation.isPending}
                    />
                </View>
            </View>

            <View style={styles.resendContainer}>
                {timer > 0 ? (
                    <Text
                        style={[
                            styles.timerText,
                            { color: isDarkMode ? darkTheme.color : lightTheme.color },
                        ]}
                    >
                        Resend code in {timer}s
                    </Text>
                ) : (
                    <View style={styles.resendSmallContainer}>
                        <Text
                            style={[
                                styles.resendText,
                                { color: isDarkMode ? darkTheme.color : lightTheme.color },
                            ]}
                        >
                            Didn't receive code?{" "}
                        </Text>

                        <TouchableOpacity onPress={handleVerificationCode}>
                            <Text
                                style={[
                                    styles.resendLink,
                                    { color: isDarkMode ? "#66b2ff" : "#0066cc" },
                                ]}
                            >
                                Send code
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </SafeAreaView>

    );
};
