'use client';

import React, { useState } from 'react';
import { EquipmentRequestSchema, EquipmentRequestCreate } from '@/lib/schema';
import { z } from 'zod';

interface Props {
    onSuccess: () => void;
}

export default function EquipmentRequestForm({ onSuccess }: Props) {
    const [formData, setFormData] = useState<EquipmentRequestCreate>({
        title: '',
        description: '',
        price: 0,
        urgency: 'low',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' ? (value ? Number(value) : 0) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setIsSubmitting(true);

        try {
            // Client-side strict validation
            EquipmentRequestSchema.omit({ id: true, status: true, createdAt: true }).parse(formData);

            const response = await fetch('/api/requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to submit request');
            }

            setFormData({ title: '', description: '', price: 0, urgency: 'low' });
            onSuccess();
        } catch (err) {
            if (err instanceof z.ZodError) {
                const fieldErrors: Record<string, string> = {};
                err.errors.forEach(error => {
                    if (error.path[0]) {
                        fieldErrors[error.path[0] as string] = error.message;
                    }
                });
                setErrors(fieldErrors);
            } else {
                setErrors({ form: 'An unexpected error occurred. Please try again.' });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="glass-card fade-in">
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Submit New Request</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label" htmlFor="title">Equipment Title</label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        className="form-input"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. MacBook Pro M3"
                    />
                    {errors.title && <p className="error-message">{errors.title}</p>}
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="description">Description & Justification</label>
                    <textarea
                        id="description"
                        name="description"
                        className="form-input"
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Why is this equipment needed?"
                    />
                    {errors.description && <p className="error-message">{errors.description}</p>}
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="price">Estimated Price ($)</label>
                    <input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        className="form-input"
                        value={formData.price || ''}
                        onChange={handleChange}
                        placeholder="0.00"
                    />
                    {errors.price && <p className="error-message">{errors.price}</p>}
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="urgency">Urgency</label>
                    <select
                        id="urgency"
                        name="urgency"
                        className="form-input form-select"
                        value={formData.urgency}
                        onChange={handleChange}
                    >
                        <option value="low">Low - Routine Upgrade</option>
                        <option value="medium">Medium - Needed Soon</option>
                        <option value="high">High - Blocking Work</option>
                    </select>
                    {errors.urgency && <p className="error-message">{errors.urgency}</p>}
                </div>

                {errors.form && <p className="error-message" style={{ marginBottom: '1rem' }}>{errors.form}</p>}

                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? <span className="loader"></span> : 'Submit Request'}
                </button>
            </form>
        </div>
    );
}
