import { Link } from "react-router-dom";

function RegisterSuccess() {
    return (
        <div className="font-main dark">
            <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4 bg-bg-light-secondary dark:bg-bg-dark-secondary">
                <div className="max-w-md w-full text-center">
                    <h2 className="text-text-light-primary dark:text-text-dark-primary text-3xl font-extrabold mb-4">
                        Registration Successful!
                    </h2>
                    <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary mb-8">
                        Your account has been successfully created. Please log in to access your account.
                    </p>
                    <Link to="/login">
                        <button className="w-full py-3 px-6 text-sm tracking-wide text-white bg-primary rounded-md hover:bg-hover-primary focus:outline-none">
                            Go to Login
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default RegisterSuccess;