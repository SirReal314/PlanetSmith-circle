// src/components/ui/label.tsx
import React from 'react';

export const Label: React.FC<{
    htmlFor: string;
    className: string;
    children: React.ReactNode;
}> = ({ htmlFor, className, children }) => {
    return (
        <label htmlFor={htmlFor} className={className}>
            {children}
        </label>
    );
};
