import { SafeAreaView, Text, View, TouchableOpacity } from "react-native";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textfield } from "../../components/atoms/Textfield/Textfield";
import { Button } from "../../components/atoms/Button/Button";
import { LoginButton } from "../../components/atoms/LoginButton/LoginButton";
import { styles } from "./SignIn.styles";
import { useNavigation } from "@react-navigation/native";

const schema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[A-Z]/, "Must contain an uppercase letter")
        .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
});

type FormData = z.infer<typeof schema>;

export const SignIn = () => {
    const navigation = useNavigation()
    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    });

    const onSubmit = (data: FormData) => {
        console.log("Submitted:", data);
    };
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.innerContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleLabel}>Welcome Back!</Text>
                    <Text style={styles.descLabel}>Sign in to your account.</Text>
                </View>
                <View style={styles.fieldsContainer}>
                    <View>
                        <Textfield
                            control={control}
                            name="email"
                            placeholder="Email"
                        />
                        {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
                    </View>
                    <View>
                        <Textfield
                            control={control}
                            name="password"
                            placeholder="Password"
                        />
                        {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
                    </View>
                </View>
                <Button onClick={handleSubmit(onSubmit)} label="SIGN IN" disabled={!isValid} />
                <Text style={styles.continueLabel}>Or Continue With</Text>
                <View style={styles.signUpByBtnContainer}>
                    <LoginButton label="G" variant="red" onClick={() => console.log("test")} />
                    <LoginButton label="F" onClick={() => console.log("test")} />
                </View>
            </View>
            <View style={styles.haveAnAccStyles}>
                <Text>You Don't Have An Account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                    <Text style={styles.loginStyle}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}