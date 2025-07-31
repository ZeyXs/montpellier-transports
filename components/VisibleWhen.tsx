import React from 'react';
import { View } from 'react-native';

export const VisibleWhen = ({
  condition,
  children,
}: {
  condition: boolean;
  children: React.ReactNode;
}) => {
  return condition ? children : null;
};
