'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

function SwaggerPage() {
  const [swaggerSpec, setSwaggerSpec] = useState(null);

  useEffect(() => {
    async function fetchSwaggerSpec() {
      const res = await fetch('/api/swagger');
      const data = await res.json();
      setSwaggerSpec(data);
    }
    fetchSwaggerSpec();
  }, []);

  if (!swaggerSpec) {
    return <div>Loading Swagger UI...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <SwaggerUI spec={swaggerSpec} />
    </div>
  );
}

export default SwaggerPage;
