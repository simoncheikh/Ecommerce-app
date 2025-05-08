export interface SearchFieldProps {
    value: string;
    onChangeText: (text: string) => void;
    onClear?: () => void;
    placeholder?: string;
}