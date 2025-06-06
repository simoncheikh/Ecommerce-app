import { Controller } from "react-hook-form"
import { TextInput } from "react-native"
import { styles } from './Textfield.styles'
import { TextfieldProps } from "./Textfield.type"
import { memo } from "react" 

export const Textfield = memo(({ control, name, placeholder, type }: TextfieldProps) => {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, value } }) => (
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor={"gray"}
                    value={value}
                    onChangeText={onChange}
                    keyboardType={type}
                    secureTextEntry={name === "password"}
                />
            )}
        />
    )
})