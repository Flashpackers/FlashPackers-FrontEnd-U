// AnimatedDiv.tsx
import React from 'react';
import styled, { keyframes } from 'styled-components';

interface AnimatedDivProps {
  className?: string; // Allow className to be passed as a prop
  children:any
}

// Define keyframes
const fadeInAnimation = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

// Apply animation to a styled component
const AnimatedDivStyled = styled.div`
  animation: ${fadeInAnimation} 1s ease-out;
`;

const AnimatedDiv: React.FC<AnimatedDivProps> = ({ className, children }) => (
  <AnimatedDivStyled className={className}>
    {children /* Corrected: Ensure children prop is properly accessed */}
  </AnimatedDivStyled>
);

export default AnimatedDiv;
