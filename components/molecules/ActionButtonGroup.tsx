import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActionButton } from '../atoms';

interface ActionButtonGroupProps {
  onPass: () => void;
  onLike: () => void;
  onSuperLike?: () => void;
  disabled?: boolean;
  buttonSize?: number;
}

const ActionButtonGroup: React.FC<ActionButtonGroupProps> = ({
  onPass,
  onLike,
  onSuperLike,
  disabled = false,
  buttonSize = 60,
}) => {
  return (
    <View style={styles.container}>
      <ActionButton
        variant="pass"
        onPress={onPass}
        size={buttonSize}
        disabled={disabled}
      />

      {onSuperLike && (
        <ActionButton
          variant="superLike"
          onPress={onSuperLike}
          size={buttonSize}
          disabled={disabled}
        />
      )}

      <ActionButton
        variant="like"
        onPress={onLike}
        size={buttonSize}
        disabled={disabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#2d0054',
    borderTopWidth: 3,
    borderTopColor: '#ff00ff',
  },
});

export default ActionButtonGroup;