import React from 'react';
import { useSubscribes } from '@/utils/subscribe';
import MediaSlider from '../MediaSlider';

const RecentlyAdded = () => {
  const { data: subjects, isLoading: subjectsIsLoading } = useSubscribes();
  return(
    <MediaSlider
      sliderKey="requests"
      title={'最近添加'}
      isLoading={subjectsIsLoading}
      titles={subjects?.data ?? []}
    />

  );
};

export default RecentlyAdded;