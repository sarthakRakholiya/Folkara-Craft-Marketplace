import React from 'react';
import Link from 'next/link';

interface OnboardingHeaderProps {
  currentStep: number;
  totalSteps: number;
}

export const OnboardingHeader = ({ currentStep, totalSteps }: OnboardingHeaderProps) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <header className="sticky top-0 z-50 w-full bg-surface/80 backdrop-blur-md border-b border-outline-variant/10">
      <div className="max-w-container-max mx-auto flex justify-between items-center px-margin-page py-4 md:py-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex items-center gap-3 overflow-hidden">
         
            <img 
              src="/logo-name.png" 
              alt="Folkara Name" 
              className="hidden sm:block h-5 md:h-8 w-auto object-contain -ml-1" 
            />
          </div>
        </Link>
        <div className="flex flex-col items-end">
          <span className="font-sans text-[10px] font-bold text-on-surface-variant mb-2 uppercase tracking-widest">
            Step {currentStep} of {totalSteps}
          </span>
          <div className="w-32 h-1 bg-surface-container rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </header>
  );
};
