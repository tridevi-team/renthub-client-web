import styled from 'styled-components';

export const ScrollableDiv = styled.div`
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
  &::-webkit-scrollbar:horizontal {
    height: 5px;
  }
  &::-webkit-scrollbar-thumb:horizontal {
    background-color: transparent;
    border-radius: 4px;
  }
  &:hover::-webkit-scrollbar-thumb:horizontal {
    background-color: #c1c1c1;
  }
  &:hover::-webkit-scrollbar-thumb:horizontal:hover {
    background-color: #a8a8a8;
  }
  &:hover::-webkit-scrollbar-thumb:horizontal:active {
    background-color: #8f8f8f;
  }
`;
