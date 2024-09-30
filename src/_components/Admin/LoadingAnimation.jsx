import React from 'react';
import Lottie from 'lottie-react';
import { AnimationData } from "../AnimationData/AnimationData";

const LoadingAnimation = () => {
    return (
        <div className="flex justify-center items-center h-screen relative">
            <div className="absolute top-80 transform -translate-y-1/2">
                <Lottie animationData={AnimationData} className="w-80 h-100" />
            </div>
        </div>
    );
};

export default LoadingAnimation;