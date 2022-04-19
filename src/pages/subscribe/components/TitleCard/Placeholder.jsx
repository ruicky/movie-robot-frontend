import React from 'react';
import styled from "styled-components/macro";


const Placeholder = () => {
  return (
    <DivContainer>
      <div style={{ paddingBottom: '150%', width: '100%' }} />
    </DivContainer>
  );
};

export default Placeholder;

const DivContainer = styled.div`
  position: relative;
  @keyframes pulse {
    50% {
      opacity: .5;
    }
  };
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  border-radius: 12px;
  background-color: #374151;
  width: 100%;
 
}
`;