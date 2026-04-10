import React, { createContext, useState } from 'react';

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [stats, setStats] = useState({
    score: 0,
    clicks: 0,
    doubleClicks: 0,
    longPresses: 0,
    pans: 0,
    pinches: 0,
    flings: 0,
    rotations: 0,
  });

  const updateStat = (actionType, points) => {
    setStats((prev) => ({
      ...prev,
      [actionType]: prev[actionType] + 1,
      score: prev.score + points,
    }));
  };

  const resetStats = () => {
    setStats({
      score: 0,
      clicks: 0,
      doubleClicks: 0,
      longPresses: 0,
      pans: 0,
      pinches: 0,
      flings: 0,
      rotations: 0,
    });
  };

  return (
    <GameContext.Provider value={{ stats, updateStat, setStats, resetStats }}>
      {children}
    </GameContext.Provider>
  );
};