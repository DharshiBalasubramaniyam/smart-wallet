export interface ButtonProps {
    text: string,
    onClick: () => void
}

export interface InputProps {
    name: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
