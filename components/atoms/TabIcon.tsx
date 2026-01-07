import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TextStyle } from 'react-native';

interface TabIconProps {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  color: string;
  size: number;
}

const TabIcon: React.FC<TabIconProps> = ({ name, focused, color, size }) => {
  const iconStyle: TextStyle = {
    textShadowColor: focused ? '#ff00ff' : 'transparent',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  };

  return (
    <Ionicons 
      name={name} 
      size={size} 
      color={color}
      style={iconStyle}
    />
  );
};

export default TabIcon;