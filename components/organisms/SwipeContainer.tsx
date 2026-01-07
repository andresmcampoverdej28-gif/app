// components/organisms/SwipeContainer.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActionButtonGroup, EmptyState, type Profile } from '../molecules';
import CardsStack from './CardsStack';

interface SwipeContainerProps {
  profiles: Profile[];
  currentIndex: number;
  onSwipe: (direction: 'left' | 'right') => void;
  onPass: () => void;
  onLike: () => void;
  onSuperLike?: () => void;
  emptyStateTitle?: string;
  emptyStateSubtitle?: string;
  emptyStateButtonText?: string;
  onEmptyStateButtonPress?: () => void;
}

const SwipeContainer: React.FC<SwipeContainerProps> = ({
  profiles,
  currentIndex,
  onSwipe,
  onPass,
  onLike,
  onSuperLike,
  emptyStateTitle = '¡No hay más perfiles!',
  emptyStateSubtitle = 'Vuelve más tarde para ver nuevos perfiles',
  emptyStateButtonText = 'Reiniciar',
  onEmptyStateButtonPress,
}) => {
  const hasProfiles = currentIndex < profiles.length;

  return (
    <View style={styles.container}>
      {hasProfiles ? (
        <>
          {/* Stack de Cards */}
          <CardsStack
            profiles={profiles}
            currentIndex={currentIndex}
            onSwipe={onSwipe}
          />

          {/* Botones de Acción */}
          <ActionButtonGroup
            onPass={onPass}
            onLike={onLike}
            onSuperLike={onSuperLike}
          />
        </>
      ) : (
        <EmptyState
          icon="heart-dislike"
          title={emptyStateTitle}
          subtitle={emptyStateSubtitle}
          buttonText={emptyStateButtonText}
          onButtonPress={onEmptyStateButtonPress}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a0033',
  },
});

export default SwipeContainer;