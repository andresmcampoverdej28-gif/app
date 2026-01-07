import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';

interface IconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  size?: number;
  iconSize?: number;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  disabled?: boolean;
  withGlow?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  size = 50,
  iconSize,
  color = '#00ffff',
  backgroundColor = 'transparent',
  borderColor,
  disabled = false,
  withGlow = false,
}) => {
  const buttonStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: disabled ? 0.5 : 1,
    ...(borderColor && {
      borderWidth: 2,
      borderColor: borderColor,
    }),
    ...(withGlow && {
      shadowColor: color,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 8,
      elevation: 8,
    }),
  };

  const calculatedIconSize = iconSize || size * 0.5;

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Ionicons name={icon} size={calculatedIconSize} color={color} />
    </TouchableOpacity>
  );
};

export default IconButton;