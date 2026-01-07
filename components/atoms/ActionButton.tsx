import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';

type ButtonVariant = 'pass' | 'superLike' | 'like';

interface ActionButtonProps {
  variant: ButtonVariant;
  onPress: () => void;
  size?: number;
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  variant,
  onPress,
  size = 60,
  disabled = false,
}) => {
  const getButtonConfig = () => {
    switch (variant) {
      case 'pass':
        return {
          icon: 'close' as keyof typeof Ionicons.glyphMap,
          backgroundColor: '#ff0090',
          borderColor: '#ff00ff',
        };
      case 'superLike':
        return {
          icon: 'star' as keyof typeof Ionicons.glyphMap,
          backgroundColor: '#9900ff',
          borderColor: '#ff00ff',
        };
      case 'like':
        return {
          icon: 'heart' as keyof typeof Ionicons.glyphMap,
          backgroundColor: '#00ff88',
          borderColor: '#00ffff',
        };
    }
  };

  const config = getButtonConfig();

  const buttonStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: config.backgroundColor,
    borderColor: config.borderColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    shadowColor: config.borderColor,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
    opacity: disabled ? 0.5 : 1,
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Ionicons name={config.icon} size={size * 0.53} color="#fff" />
    </TouchableOpacity>
  );
};

export default ActionButton;