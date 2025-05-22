import { Control } from "react-hook-form"

export type TextfieldProps = {
    name: string,
    placeholder: string,
    control: Control<any>
    type?: string
}