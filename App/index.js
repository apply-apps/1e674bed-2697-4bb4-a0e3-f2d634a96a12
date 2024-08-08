// Filename: index.js
// Combined code from all files

import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, StyleSheet, View, Button, Alert } from 'react-native';

// Constants used in the SnakeGame component
const CELL_SIZE = 20;
const GRID_SIZE = 15;
const INITIAL_SNAKE_POSITION = [
    [0, 2],
    [0, 1],
    [0, 0],
];
const INITIAL_DIRECTION = 'RIGHT';

// Function to generate a random food position
const generateFoodPosition = () => {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    return [x, y];
};

// SnakeGame component
const SnakeGame = () => {
    const [snake, setSnake] = useState(INITIAL_SNAKE_POSITION);
    const [food, setFood] = useState(generateFoodPosition());
    const [direction, setDirection] = useState(INITIAL_DIRECTION);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (!isPlaying) return;
        const interval = setInterval(moveSnake, 200);
        return () => clearInterval(interval);
    }, [snake, direction, isPlaying]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            switch (event.key) {
                case 'ArrowUp':
                    if (direction !== 'DOWN') setDirection('UP');
                    break;
                case 'ArrowDown':
                    if (direction !== 'UP') setDirection('DOWN');
                    break;
                case 'ArrowLeft':
                    if (direction !== 'RIGHT') setDirection('LEFT');
                    break;
                case 'ArrowRight':
                    if (direction !== 'LEFT') setDirection('RIGHT');
                    break;
                default:
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [direction]);

    const moveSnake = () => {
        const newSnake = [...snake];
        const head = newSnake[0];

        let newHead;

        switch (direction) {
            case 'UP':
                newHead = [head[0], head[1] - 1];
                break;
            case 'DOWN':
                newHead = [head[0], head[1] + 1];
                break;
            case 'LEFT':
                newHead = [head[0] - 1, head[1]];
                break;
            case 'RIGHT':
                newHead = [head[0] + 1, head[1]];
                break;
        }

        newSnake.unshift(newHead);

        if (newHead[0] === food[0] && newHead[1] === food[1]) {
            setFood(generateFoodPosition());
        } else {
            newSnake.pop();
        }

        // Check for game over
        if (
            newHead[0] < 0 ||
            newHead[1] < 0 ||
            newHead[0] >= GRID_SIZE ||
            newHead[1] >= GRID_SIZE ||
            newSnake.slice(1).some((item) => item[0] === newHead[0] && item[1] === newHead[1])
        ) {
            setIsPlaying(false);
            Alert.alert('Game Over', `Score: ${snake.length - 3}`, [
                { text: 'Restart', onPress: () => restartGame() },
            ]);
            return;
        }

        setSnake(newSnake);
    };

    const restartGame = () => {
        setSnake(INITIAL_SNAKE_POSITION);
        setFood(generateFoodPosition());
        setDirection(INITIAL_DIRECTION);
        setIsPlaying(true);
    };

    return (
        <View style={snakeGameStyles.container}>
            <View style={snakeGameStyles.grid}>
                {Array.from({ length: GRID_SIZE }).map((_, row) => (
                    <View key={row} style={snakeGameStyles.row}>
                        {Array.from({ length: GRID_SIZE }).map((_, col) => (
                            <View
                                key={col}
                                style={[
                                    snakeGameStyles.cell,
                                    snake.some((segment) => segment[0] === col && segment[1] === row) && snakeGameStyles.snake,
                                    food[0] === col && food[1] === row && snakeGameStyles.food,
                                ]}
                            />
                        ))}
                    </View>
                ))}
            </View>
            {!isPlaying && <Button title="Start Game" onPress={() => setIsPlaying(true)} />}
        </View>
    );
};

const snakeGameStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    grid: {
        flexDirection: 'column',
        borderWidth: 1,
        borderColor: '#000',
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        borderWidth: 1,
        borderColor: '#eee',
    },
    snake: {
        backgroundColor: 'green',
    },
    food: {
        backgroundColor: 'red',
    },
});

// App component
export default function App() {
    return (
        <SafeAreaView style={appStyles.container}>
            <Text style={appStyles.title}>Snake Game</Text>
            <SnakeGame />
        </SafeAreaView>
    );
}

const appStyles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
    },
});