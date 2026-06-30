import { useState } from 'react';
import apiClient from '../apis/apiClient';
// import console from '../utils/console';

const headers = {
  'Content-Type': 'application/json',
};

const usePatchQuery = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [error, setError] = useState();

  const patchQuery = async (params: any) => {
    const {
      url,
      onSuccess = () => {
        console.log('onSuccess function');
      },
      onFail = () => {
        console.log('onFail function');
      },
      patchData,
    } = params;
    setLoading(true);
    try {
      const { data: apiData = {} } = await apiClient.patch(url, patchData, {
        headers: headers,
      });
      setData(apiData);
      await onSuccess(apiData);
      console.log(apiData, 'putQuery-success');
    } catch (err: any) {
      onFail(err);
      console.log(err, 'putQuery-fail');
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    patchQuery,
    loading,
    setLoading,
    data,
    setData,
    error,
    setError,
  };
};

export default usePatchQuery;
