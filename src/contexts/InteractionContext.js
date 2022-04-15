import React from 'react';
import useInteraction from '../hooks/useInteraction';



export const InteractionContext = React.createContext({
  isTouch: false,
});

export const InteractionProvider = ({ children }) => {
  const isTouch = useInteraction();

  return (
    <InteractionContext.Provider value={{ isTouch }}>
      {children}
    </InteractionContext.Provider>
  );
};
