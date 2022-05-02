import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

function OAuth() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const isSuccess = searchParams.get('success') == '1';
    const providerType = searchParams.get('type');

    if (window.opener) {
      window.opener.postMessage({ isSuccess, providerType });
      window.close();
    }
  }, [searchParams]);

  return <div className="text-center text-2xl font-bold">Loading...</div>;
}

export default OAuth;
