import { useContext } from 'react';
import { InteractionContext } from '@/contexts/InteractionContext';

export const useIsTouch = () => {
  const { isTouch } = useContext(InteractionContext);
  return isTouch;
};
