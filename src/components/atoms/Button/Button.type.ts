export type ButtonProps = {
    onClick: () => void,
    label: string,
    disabled: boolean,
    variant?: "primary" | "secondary"
}