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

const codeSchema = z.object({
    code: z.array(z.string().length(1)).length(6),
});

type CodeForm = z.infer<typeof codeSchema>;

export const VerificationPage = ({ navigation, route }: any) => {
    const { login } = useAuthStore();
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


    const onSubmit = async (data: CodeForm) => {
        const codeString = data.code.join("");

        try {
            const res = await verificationApi({
                email: email,
                otp: codeString,
            });

            console.log("Verification response:", res);

            if (res?.success) {
                if (res.token) {
                    login(res.token);
                    navigation.navigate("SignIn");
                } else {
                    Alert.alert("Error", "Verification succeeded, but token is missing.");
                }
            } else {
                setSubmitError("Invalid verification code");
                reset({ code: ["", "", "", "", "", ""] });
                inputs.current[0]?.focus();
            }
        } catch (error) {
            console.error("Verification error:", error);
            Alert.alert("Error", "Something went wrong. Please try again.");
        }
    };


    const handleVerificationCode = async () => {
        setTimer(30);
        const response = await resendVerificationApi(email);

        if (response.success) {
            Alert.alert("Success", response.message);
        } else {
            Alert.alert("Error", response.message);
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <Image source={require("../../assets/store.png")} />
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Verification Code</Text>
                <Text style={styles.subtitle}>Enter the code sent to your email</Text>
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
                                    style={styles.input}
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

                <Text style={styles.errorText}>{submitError && "Code is wrong."}</Text>

                <View style={styles.button}>
                    <Button
                        label={submitError || "Submit"}
                        onClick={handleSubmit(onSubmit)}
                        variant="primary"
                        disabled={!isValid}
                    />
                </View>
            </View>

            <View style={styles.resendContainer}>
                {timer > 0 ? (
                    <Text style={styles.timerText}>Resend code in {timer}s</Text>
                ) : (
                    <TouchableOpacity onPress={handleVerificationCode}>
                        <Text style={styles.resendText}>
                            Didn't receive code?{" "}
                            <Text style={styles.resendLink}>Send code</Text>
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
};
