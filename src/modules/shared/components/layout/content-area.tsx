import { Card, CardContent } from '@shared/components/ui/card';
import type React from 'react';
import styled from 'styled-components';

const StyledCard = styled(Card)`
 &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: transparent;
    border-radius: 4px;
  }
  &:hover::-webkit-scrollbar-thumb {
    background-color: #c1c1c1;
  }
  &:hover::-webkit-scrollbar-thumb:hover {
    background-color: #a8a8a8;
  }
  &:hover::-webkit-scrollbar-thumb:active {
    background-color: #8f8f8f;
  }
  &::-webkit-scrollbar-button {
    display: none;
  }
`;

export default function ContentArea({
  children,
}: { children: React.ReactNode }) {
  return (
    <StyledCard className="mt-4 max-h-[81vh] overflow-auto rounded-lg border-none pb-4">
      <CardContent className="px-6 py-4">
        <div className="flex min-h-[calc(0vh)]">
          <div className="w-full">{children}</div>
        </div>
      </CardContent>
    </StyledCard>
  );
}
