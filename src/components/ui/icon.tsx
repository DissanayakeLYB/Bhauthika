import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import type { ComponentProps } from 'react';
import { colors } from '@/theme';

export type IconName = ComponentProps<typeof MaterialIcons>['name'];

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

export function Icon({ name, size = 22, color = colors.ink }: IconProps) {
  return <MaterialIcons name={name} size={size} color={color} />;
}
