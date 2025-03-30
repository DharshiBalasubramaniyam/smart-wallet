export interface ButtonProps {
    text: string,
    type?: "button" | "submit" | "reset";
    onClick?: () => void
}

export interface InputProps {
    name: string;
    type: string;
    placeholder: string;
    value: string;
    maxLength?: number;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
