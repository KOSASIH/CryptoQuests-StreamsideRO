import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import Webview from 'react-native-webview';

const GameBoard = () => {
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    fetchGameState();
  }, []);

  const fetchGameState = async () => {
    const response = await axios.get('http://localhost:5000/game-state');
    setGameState(response.data);
  };

  const handleAction = async (action) => {
    const response = await axios.post('http://localhost:5000/handle-action', action);
    setGameState(response.data);
  };

  return (
    <View style={styles.container}>
      {gameState && (
        <View style={styles.board}>
          {/* Render the game state here */}
        </View>
      )}
      <Webview
        originWhitelist={['*']}
        source={{ uri: 'http://localhost:5000/game-view' }}
        onMessage={(event) => {
          const action = JSON.parse(event.nativeEvent.data);
          handleAction(action);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  board: {
    width: '100%',
    height: '100%',
  },
});

export default GameBoard;
