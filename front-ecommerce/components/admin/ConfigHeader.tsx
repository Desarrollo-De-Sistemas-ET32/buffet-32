"use client"
import React from 'react'
import { Settings } from 'lucide-react'

interface ConfigHeaderProps {
    title: string;
    description: string;
    icon?: React.ReactNode;
}

const ConfigHeader: React.FC<ConfigHeaderProps> = ({
    title,
    description,
    icon = <Settings className="h-6 w-6" />
}) => {
    return (
        <div className="flex items-center gap-3 p-6 border-b">
            {icon}
            <div>
                <h2 className="text-2xl font-bold">{title}</h2>
                <p className="text-base text-muted-foreground">
                    {description}
                </p>
            </div>
        </div>
    );
};

export default ConfigHeader; 