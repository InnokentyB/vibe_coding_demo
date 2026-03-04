'use client';

import React, { useState } from 'react';
import EquipmentRequestForm from '@/components/EquipmentRequestForm';
import RequestList from '@/components/RequestList';

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRequestAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="main-grid">
      <aside>
        <EquipmentRequestForm onSuccess={handleRequestAdded} />
      </aside>

      <section>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', paddingLeft: '0.5rem' }}>
          Recent Requests
        </h2>
        <RequestList refreshTrigger={refreshTrigger} />
      </section>
    </div>
  );
}
