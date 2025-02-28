// eslint-disable-next-line react/prop-types
function Input({ name, type, placeholder, value, onChange }) {
    return (
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="bg-bg-light-primary dark:bg-bg-dark-primary w-full p-3 my-3 rounded border-2 border-border-light-primary dark:border-border-dark-primary text-text-light-primary dark:text-text-dark-primary outline-none focus:border-primary focus:bg-transparent text-sm"
        />
    );
}

export default Input;
