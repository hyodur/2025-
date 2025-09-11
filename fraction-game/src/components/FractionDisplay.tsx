import React from 'react';
import styled from 'styled-components';
import { Fraction } from '../types/game';

interface FractionDisplayProps {
  fraction: Fraction;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

const FractionContainer = styled.div<{ $size: string; $color: string }>`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Arial', sans-serif;
  font-weight: bold;
  color: ${props => props.$color};
  
  ${props => {
    switch (props.$size) {
      case 'small':
        return 'font-size: 1rem;';
      case 'medium':
        return 'font-size: 1.5rem;';
      case 'large':
        return 'font-size: 2rem;';
      default:
        return 'font-size: 1.5rem;';
    }
  }}
`;

const Numerator = styled.div`
  text-align: center;
  line-height: 1;
  margin-bottom: 2px;
`;

const Denominator = styled.div`
  text-align: center;
  line-height: 1;
  margin-top: 2px;
`;

const FractionLine = styled.div<{ $size: string }>`
  width: 100%;
  height: 2px;
  background-color: currentColor;
  min-width: ${props => {
    switch (props.$size) {
      case 'small': return '20px';
      case 'medium': return '30px';
      case 'large': return '40px';
      default: return '30px';
    }
  }};
`;

const WholeNumber = styled.span`
  margin-right: 8px;
`;

const MixedFraction = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const FractionDisplay: React.FC<FractionDisplayProps> = ({
  fraction,
  size = 'medium',
  color = '#333',
  className
}) => {
  // 대분수로 표시할지 확인
  const isImproper = Math.abs(fraction.numerator) > fraction.denominator && fraction.denominator !== 1;
  
  if (fraction.denominator === 1) {
    // 정수인 경우
    return (
      <FractionContainer $size={size} $color={color} className={className}>
        {fraction.numerator}
      </FractionContainer>
    );
  }
  
  if (isImproper) {
    // 대분수로 표시
    const wholeNumber = Math.floor(Math.abs(fraction.numerator) / fraction.denominator);
    const remainder = Math.abs(fraction.numerator) % fraction.denominator;
    const sign = fraction.numerator < 0 ? '-' : '';
    
    if (remainder === 0) {
      return (
        <FractionContainer $size={size} $color={color} className={className}>
          {sign}{wholeNumber}
        </FractionContainer>
      );
    }
    
    return (
      <FractionContainer $size={size} $color={color} className={className}>
        <MixedFraction>
          <WholeNumber>{sign}{wholeNumber}</WholeNumber>
          <div>
            <Numerator>{remainder}</Numerator>
            <FractionLine $size={size} />
            <Denominator>{fraction.denominator}</Denominator>
          </div>
        </MixedFraction>
      </FractionContainer>
    );
  }
  
  // 일반 분수로 표시
  return (
    <FractionContainer $size={size} $color={color} className={className}>
      <Numerator>{fraction.numerator}</Numerator>
      <FractionLine $size={size} />
      <Denominator>{fraction.denominator}</Denominator>
    </FractionContainer>
  );
};