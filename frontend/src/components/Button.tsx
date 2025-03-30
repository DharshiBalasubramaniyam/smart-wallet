import { ButtonProps } from "@/interfaces/props";

// eslint-disable-next-line react/prop-types
function Button({ text, type, onClick }: ButtonProps) {
    return (
        <button
            type={type ?? "button"}
            onClick={onClick}
            className="w-full shadow-xl py-2.5 px-4 text-sm font-semibold rounded text-text-dark-primary bg-secondary hover:bg-primary focus:outline-none active:scale-98"
        >
            {text}
        </button>
    )
}

export default Button;
