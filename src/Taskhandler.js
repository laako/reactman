import React, { useState, useEffect, useRef } from 'react';
import Player from './Player';
import useInterval from './helpers/useInterval';

const Taskhandler = () => {
	const [playerDirection, setPlayerDirection] = useState('');
	const [playerMoving, setPlayerMoving] = useState(false);
	const [foodPosition, setFoodPosition] = useState([]);
	const [playerPosition, setPlayerPosition] = useState({
		x: 0,
		y: 0
	});
	const [score, setScore] = useState(0)
	const playgroundSettings = {
		width: 200,
		height: 200,
		tickrate: 200,
		speed: 20
	}

	const generateFoodPosition = () => {
		const step = playgroundSettings.speed;
		let foods = [];
		for (let x = playgroundSettings.width; x >= 0; x -= step) {
			for (let y = playgroundSettings.height; y >= 0; y -= step) {
				foods.push({ x, y });
			}
		}
		setFoodPosition(() => foods);
	};

	const handleKeydown = e => {
		const up = e.key === 'ArrowUp';
		const down = e.key === 'ArrowDown';
		const left = e.key === 'ArrowLeft';
		const right = e.key === 'ArrowRight';
		const space = e.key === ' ';

		if (space) {
			setPlayerDirection(() => '');
			return;
		}

		setPlayerDirection(prev =>
			up ? 'up' : down ? 'down' : left ? 'left' : right ? 'right' : prev
		);

		if (!playerMoving && (up || down || left || right))
			setPlayerMoving(() => true);
	};

	useInterval(() => {
		if (playerMoving) {
			if (!playerDirection) return;

			setPlayerPosition(prevPos => {
				if (
					(playerDirection === 'left' &&
						prevPos.x - playgroundSettings.speed < 0) ||
					(playerDirection === 'right' &&
						prevPos.x + playgroundSettings.speed >
							playgroundSettings.width)
				) {
					setPlayerMoving(() => false);
					return prevPos;
				} else if (
					(playerDirection === 'up' &&
						prevPos.y - playgroundSettings.speed < 0) ||
					(playerDirection === 'down' &&
						prevPos.y + playgroundSettings.speed >
							playgroundSettings.height)
				) {
					setPlayerMoving(() => false);
					return prevPos;
				}
				return {
					x:
						playerDirection === 'left'
							? prevPos.x - playgroundSettings.speed
							: playerDirection === 'right'
							? prevPos.x + playgroundSettings.speed
							: prevPos.x,
					y:
						playerDirection === 'up'
							? prevPos.y - playgroundSettings.speed
							: playerDirection === 'down'
							? prevPos.y + playgroundSettings.speed
							: prevPos.y
				};
			});
		}
	}, playgroundSettings.tickrate);

	useEffect(() => {
		generateFoodPosition();
		document.addEventListener('keydown', handleKeydown);
		return () => document.removeEventListener('keydown', handleKeydown);
	}, []);

	const playgroundStyle = {
		position: 'relative',
		paddingRight: '20px',
		paddingBottom: '20px',
		width: `${playgroundSettings.width}px`,
		height: `${playgroundSettings.height}px`,
		border: '1px solid black',
		background: 'black'
	};

	const initialRender = useRef(true);
	useEffect(() => {
		if (initialRender.current) {
			initialRender.current = false;
			return;
		}
		const foodLeft = foodPosition.filter(
			singleFoodPosition =>
				!(singleFoodPosition.x === playerPosition.x &&
				singleFoodPosition.y === playerPosition.y)
		);
		if (foodLeft.length < foodPosition.length) {
			setScore(prev => prev + 1)
		}
		setFoodPosition(() => foodLeft);
	}, [playerPosition]);

	return (
		<>
			<div style={playgroundStyle}>
				<Player
					playerDirection={playerDirection}
					playerPosition={playerPosition}
					playgroundSettings={playgroundSettings}
				/>
				{foodPosition.map((singleFood, i) => {
					const style = {
						position: 'absolute',
						top: `${singleFood.y}px`,
						left: `${singleFood.x}px`,
						border: '1px solid red',
						display: 'inline-block',
						transform: 'translate(15px, 10px)',
					};
					return <div key={i} style={style}></div>;
				})}
			</div>
			<p>Score: {score}</p>
		</>
	);
};

export default Taskhandler;
