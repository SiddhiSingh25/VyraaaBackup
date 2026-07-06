import React from 'react';

// Define the shape of an attribute
interface Attribute {
    label: string;
    value: string;
}

interface AttributesProps {
    attributes: Attribute[];
    onAdd?: () => void;
}

export const AttributesCard: React.FC<AttributesProps> = ({ attributes, onAdd }) => {
    return (
        <section className="bg-surface-bright rounded-lg border border-outline-variant p-[24px] ambient-shadow">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 border-b border-outline-variant/30 pb-4">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">label</span>
                    <h3 className="font-headline-sm text-headline-sm text-on-background">Attributes</h3>
                </div>
                <button
                    onClick={onAdd}
                    className="text-primary hover:opacity-80 transition-opacity"
                >
                    <span className="material-symbols-outlined">add_circle</span>
                </button>
            </div>

            {/* Attributes List */}
            <div className="space-y-3">
                {attributes.map((attr, index) => (
                    <div key={index} className="flex gap-3">
                        <div className="w-1/3 bg-surface-container-low border border-outline-variant rounded p-2 text-body-md text-on-surface-variant font-medium flex items-center">
                            {attr.label}
                        </div>
                        <div className="flex-1 bg-surface-container-low border border-outline-variant rounded p-2 text-body-md text-on-background flex items-center">
                            {attr.value}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};