'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { EquipmentRequest } from '@/lib/schema';

export default function RequestList({ refreshTrigger }: { refreshTrigger: number }) {
    const [requests, setRequests] = useState<EquipmentRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRequests = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/requests');
            if (!res.ok) throw new Error('Failed to fetch requests');
            const data = await res.json();
            setRequests(data);
            setError(null);
        } catch (err) {
            setError('Could not load requests.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests, refreshTrigger]);

    if (loading && requests.length === 0) {
        return (
            <div className="glass-card empty-state fade-in">
                <div className="loader" style={{ margin: '0 auto', marginBottom: '1rem' }}></div>
                <p>Loading requests...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="glass-card empty-state fade-in" style={{ borderColor: 'var(--error-color)' }}>
                <p style={{ color: 'var(--error-color)' }}>{error}</p>
            </div>
        );
    }

    if (requests.length === 0) {
        return (
            <div className="glass-card empty-state fade-in">
                <p>No equipment requests found.</p>
                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Submit a new request to get started.</p>
            </div>
        );
    }

    return (
        <div className="request-list">
            {requests.map((req, index) => (
                <div
                    key={req.id}
                    className="glass-card request-item fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                >
                    <div style={{ flex: 1 }}>
                        <h3 className="req-title">{req.title}</h3>
                        <p className="req-desc">{req.description}</p>
                        <div className="req-meta">
                            <span className={`badge badge-${req.urgency}`}>
                                {req.urgency} Urgency
                            </span>
                            <span className={`badge badge-${req.status}`}>
                                {req.status}
                            </span>
                            <span className="badge badge-outline">
                                {new Date(req.createdAt!).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                    <div style={{ marginLeft: '1rem' }}>
                        <span className="req-price">
                            ${req.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
