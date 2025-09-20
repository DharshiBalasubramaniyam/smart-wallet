import { IconType } from "react-icons";

export interface ButtonProps {
    text: React.ReactNode,
    type?: "button" | "submit" | "reset";
    onClick?: () => void,
    className?: string,
    disabled?: boolean,
    priority?: "primary" | "secondary"
}

export interface InputProps {
    name: string;
    type: string;
    placeholder: string;
    value: string;
    maxLength?: number;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string,
    min?: string
    id?:string
    disabled?: boolean
}
