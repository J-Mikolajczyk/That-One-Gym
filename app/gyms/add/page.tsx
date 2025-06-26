'use client';
import { signIn, useSession } from "next-auth/react";
import { useState, FormEvent } from "react";

export default function AddGymPage() {
    const { data: session } = useSession();

    const [message, setMessage] = useState('');
    
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const gymName = formData.get('gymName') as string;
        const addressLine1 = formData.get('address-line1') as string;
        const addressLine2 = formData.get('address-line2') as string;
        const city = formData.get('city') as string;
        const state = formData.get('state') as string;
        const zip = formData.get('zip') as string;
        
        try {
            const response = await fetch('/api/gyms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    gymName,
                    address: {
                        line1: addressLine1,
                        line2: addressLine2,
                        city,
                        state,
                        zip,
                    },
                }),
            });
            if (!response.ok) {
                setMessage('Failed to add gym' + response.statusText);
                throw new Error('Failed to add gym');
            }
            const result = await response.json();
            setMessage('Gym added successfully');
            console.log('Gym added successfully:', result);
        } catch (error) {
            setMessage('Error adding gym' + error);
            console.error('Error adding gym:', error);
        }
    }


    if (!session) {
        return (
            <div className="flex flex-col min-h-screen min-w-screen bg-neutral-900 p-6">
                <h1 className="font-bold text-white text-2xl">That One Gym</h1>
                <div className="flex flex-col items-center justify-center bg-neutral-900 my-auto">
                    <h1 className="text-white text-2xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center">Please sign in to add a gym</h1>
                    <button
                        onClick={() => signIn()}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Sign In
                    </button>
                </div>
            </div>
        );
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900">
            <h1 className="text-white text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">Add a Gym</h1>
            <form className="mt-8 w-full max-w-md"
                  onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmit(e as FormEvent<HTMLFormElement>);
                  }}
                  autoComplete="off"
            >
                <div className="mb-4">
                    <label className="block text-white mb-2" htmlFor="gymName">Gym Name</label>
                    <input
                        type="text"
                        id="gymName"
                        name="gymName"
                        className="w-full p-2 bg-neutral-800 text-white rounded-lg"
                        placeholder="Enter gym name"
                        required
                        autoComplete="off"
                    />
                </div>
                <div className="flex flex-col mb-4 gap-2">
                    <label className="block text-white" htmlFor="location">Location</label>
                    <input
                        type="text"
                        id="address-line1"
                        name="address-line1"
                        className="w-full p-2 bg-neutral-800 text-white rounded-lg"
                        placeholder="Address Line 1"
                        required
                        autoComplete="off"
                    />
                    <input
                        type="text"
                        id="address-line2"
                        name="address-line2"
                        className="w-full p-2 bg-neutral-800 text-white rounded-lg"
                        placeholder="Address Line 2 (optional)"
                        autoComplete="off"
                    />
                    <input
                        type="text"
                        id="city"
                        name="city"
                        className="w-full p-2 bg-neutral-800 text-white rounded-lg"
                        placeholder="City"
                        required
                        autoComplete="off"
                    />
                    <input
                        type="text"
                        id="state"
                        name="state"
                        className="w-full p-2 bg-neutral-800 text-white rounded-lg"
                        placeholder="State"
                        required
                        autoComplete="off"
                    />
                    <input
                        type="text"
                        id="zip"
                        name="zip"
                        className="w-full p-2 bg-neutral-800 text-white rounded-lg"
                        placeholder="ZIP Code"
                        required
                        autoComplete="off"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Add Gym
                </button>
            </form>
            <div className="mt-4 text-white">
                <p>{message}</p>
            </div>
        </div>
    );
}