import React, { useEffect, useState } from 'react';
import { PlanInfo } from '@/interfaces/modals';
import { AuthService } from '@/services/auth/auth.service';

const Plans: React.FC = () => {
    const [plans, setPlans] = useState<PlanInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const { getAllPlans } = AuthService();

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const plansData = await getAllPlans();
                setPlans(plansData);
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>;
    }

    return (
        <div className="container mx-auto px-4 py-16">
            <h1 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h1>
            <div className="grid md:grid-cols-3 gap-8">
                {plans.map((plan) => (
                    <div key={plan.name} 
                         className="border rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow 
                                  duration-300 flex flex-col">
                        <div className="flex-grow">
                            <h2 className="text-2xl font-semibold mb-4">{plan.name}</h2>
                            <p className="text-gray-600 mb-4">{plan.description}</p>
                            <div className="mb-6">
                                <span className="text-4xl font-bold">
                                    {plan.currency} {plan.price}
                                </span>
                                <span className="text-gray-600">/month</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-center">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" 
                                             stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" 
                                                  strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <button className="w-full bg-blue-600 text-white rounded-md py-2 px-4 
                                         hover:bg-blue-700 transition-colors duration-300">
                            Select Plan
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Plans;
