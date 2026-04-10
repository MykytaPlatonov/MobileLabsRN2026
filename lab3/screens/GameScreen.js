import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Directions, Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { GameContext } from '../GameContext';

export default function GameScreen() {
  const { stats, updateStat } = useContext(GameContext); 

  const offset = useSharedValue({ x: 0, y: 0 });
  const start = useSharedValue({ x: 0, y: 0 });
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const savedRotation = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      offset.value = { x: event.translationX + start.value.x, y: event.translationY + start.value.y };
    })
    .onEnd(() => {
      start.value = { x: offset.value.x, y: offset.value.y };
      runOnJS(updateStat)('pans', 0); 
    });

  const flingRight = Gesture.Fling().direction(Directions.RIGHT)
    .onEnd(() => { runOnJS(updateStat)('flings', 15); });

  const flingLeft = Gesture.Fling().direction(Directions.LEFT)
    .onEnd(() => { runOnJS(updateStat)('flings', 15); });

  const panWithFling = Gesture.Exclusive(flingRight, flingLeft, panGesture);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => { scale.value = savedScale.value * event.scale; })
    .onEnd(() => {
      runOnJS(updateStat)('pinches', 5);
      scale.value = withSpring(1);
      savedScale.value = 1;
    });

  const rotationGesture = Gesture.Rotation()
    .onUpdate((event) => { rotation.value = savedRotation.value + event.rotation; })
    .onEnd(() => {
      savedRotation.value = rotation.value;
      runOnJS(updateStat)('rotations', 20);
    });

  const singleTap = Gesture.Tap().onEnd((_e, success) => { if (success) runOnJS(updateStat)('clicks', 1); });
  const doubleTap = Gesture.Tap().numberOfTaps(2).onEnd((_e, success) => { if (success) runOnJS(updateStat)('doubleClicks', 10); });
  const longPress = Gesture.LongPress().minDuration(800).onEnd((_e, success) => { if (success) runOnJS(updateStat)('longPresses', 50); });

  const taps = Gesture.Exclusive(doubleTap, singleTap, longPress);

  const composedGesture = Gesture.Simultaneous(panWithFling, pinchGesture, rotationGesture, taps);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: offset.value.x },
      { translateY: offset.value.y },
      { scale: scale.value },
      { rotateZ: `${(rotation.value / Math.PI) * 180}deg` },
    ],
  }));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreText}>Очки: {stats.score}</Text> 
        </View>

        <View style={styles.gameBox}>
          <GestureDetector gesture={composedGesture}>
            <Animated.View style={[styles.target, animatedStyle]}>
              <Text style={styles.targetText}>TAP</Text>
            </Animated.View>
          </GestureDetector>
        </View>
        
        <Text style={styles.hint}>
          Тикни: 1 | Двічі: 10 | Затисни: 50{"\n"}
          Свайп: 15 | Розтягни: 5 | Крути: 20
        </Text>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa', alignItems: 'center' },
  scoreBadge: { marginTop: 20, backgroundColor: '#fff', paddingHorizontal: 30, paddingVertical: 10, borderRadius: 50, elevation: 4 },
  scoreText: { fontSize: 24, fontWeight: 'bold', color: '#e29c4a' },
  gameBox: { flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' },
  target: { width: 150, height: 150, borderRadius: 75, backgroundColor: '#e24a90', justifyContent: 'center', alignItems: 'center', elevation: 8 },
  targetText: { color: '#fff', fontWeight: '900', fontSize: 20 },
  hint: { marginBottom: 50, color: '#888', fontStyle: 'italic', textAlign: 'center', lineHeight: 24 }
});