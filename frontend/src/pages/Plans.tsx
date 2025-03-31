import React, { useEffect, useState } from 'react';
import { PlanInfo } from '../interfaces/modals';
import { AuthService } from '../services/auth/auth.service';
import Button from '../components/Button';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';

const Plans: React.FC = () => {
    const [plans, setPlans] = useState<PlanInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const { getAllPlans, subscribePlan } = AuthService();
    const email = useSelector((state: RootState) => state.auth.email);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const plansData = await getAllPlans();
                console.log(plansData);
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

    async function handlePlanSelection(plan: PlanInfo): Promise<void> {
        if (!email) return;
        await subscribePlan({autoRenew: false, email: email, planId: plan._id}, plan.name);
    }

    return (
        <div className="font-main dark">
            <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4 bg-bg-light-secondary dark:bg-bg-dark-secondary">
                <div className="max-w-6xl w-full">
                    <h1 className="text-4xl font-extrabold text-center mb-12 text-text-light-primary dark:text-text-dark-primary">
                        Choose Your Plan
                    </h1>
                    <div className="grid md:grid-cols-3 gap-8">
                        {plans.map((plan) => (
                            <div key={plan.name}
                                className="border border-border-light-primary dark:border-border-dark-primary 
                                        rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 
                                        flex flex-col bg-bg-light-primary dark:bg-bg-dark-primary">
                                <div className="flex-grow">
                                    <h2 className="text-2xl font-semibold mb-4 text-text-light-primary dark:text-text-dark-primary">
                                        {plan.name}
                                    </h2>
                                    <p className="text-text-light-secondary dark:text-text-dark-secondary mb-4">
                                        {plan.description}
                                    </p>
                                    <div className="mb-6">
                                        <span className="text-4xl font-bold text-text-light-primary dark:text-text-dark-primary">
                                            {plan.currency} {plan.price}
                                        </span>
                                        <span className="text-text-light-secondary dark:text-text-dark-secondary ml-2">
                                            /month
                                        </span>
                                    </div>
                                    <ul className="space-y-3 mb-8">
                                        {plan.features.map((feature, index) => (
                                            <li key={index} 
                                                className="flex items-center text-text-light-secondary dark:text-text-dark-secondary">
                                                <svg className="w-5 h-5 text-primary mr-2" 
                                                    fill="none"
                                                    stroke="currentColor" 
                                                    viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" 
                                                        strokeLinejoin="round"
                                                        strokeWidth="2" 
                                                        d="M5 13l4 4L19 7" />
                                                </svg>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <Button
                                    text="Select Plan"
                                    onClick={() => handlePlanSelection(plan)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Plans;
