import React, { useState, useEffect, useRef } from 'react';
import Player from './Player';
import useInterval from './helpers/useInterval';
import Ghost from './Ghost';

const Taskhandler = () => {
	const [playerDirection, setPlayerDirection] = useState('');
	const [playerMoving, setPlayerMoving] = useState(false);
	const [ghostsMoving, setGhostsMoving] = useState(false);
	const [foodPosition, setFoodPosition] = useState([]);
	const [playerPosition, setPlayerPosition] = useState({
		x: 0,
		y: 0
	});
	const [ghostPosition, setGhostPosition] = useState({ x: 200, y: 200 });
	const [score, setScore] = useState(0);
	const playgroundSettings = {
		width: 200,
		height: 200,
		tickrate: 100,
		speed: 20
	};

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

	const moveGhosts = () => {
		setGhostPosition(prev => {
			// Get random direction
			let randomNum = Math.floor(Math.random() * Math.floor(4));
			const up = randomNum === 0;
			const left = randomNum === 1;
			const right = randomNum === 2;
			const down = randomNum === 3;
			return {
				x: left && (prev.x - playgroundSettings.speed > 0)
					? prev.x - playgroundSettings.speed
					: right && (prev.x + playgroundSettings.speed < playgroundSettings.width)
					? prev.x + playgroundSettings.speed
					: prev.x,
				y: up && (prev.y - playgroundSettings.speed > 0)
					? prev.y - playgroundSettings.speed
					: down && (prev.y + playgroundSettings.speed < playgroundSettings.height)
					? prev.y + playgroundSettings.speed
					: prev.y
			};
		});
	};

	const handleKeydown = e => {
		const up = e.key === 'ArrowUp';
		const down = e.key === 'ArrowDown';
		const left = e.key === 'ArrowLeft';
		const right = e.key === 'ArrowRight';

		setPlayerDirection(prev =>
			up ? 'up' : down ? 'down' : left ? 'left' : right ? 'right' : prev
		);

		if (!playerMoving && (up || down || left || right)) {
			setPlayerMoving(() => true);
			if (!ghostsMoving) setGhostsMoving(() => true);
		}
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
		if (ghostsMoving) moveGhosts();
	}, playgroundSettings.tickrate);

	useEffect(() => {
		generateFoodPosition();
		document.addEventListener('keydown', handleKeydown);
		// return () => document.removeEventListener('keydown', handleKeydown);
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
				!(
					singleFoodPosition.x === playerPosition.x &&
					singleFoodPosition.y === playerPosition.y
				)
		);
		if (foodLeft.length < foodPosition.length) {
			setScore(prev => prev + 1);
		}
		setFoodPosition(() => foodLeft);
		if (foodPosition.length === 0) {
			alert('Voitit pelin');
			setPlayerMoving(() => false);
			setGhostsMoving(() => false);
		}
		if (
			playerPosition.x === ghostPosition.x &&
			playerPosition.y === ghostPosition.y
		) {
			alert('Hävisit pelin');
			setPlayerMoving(() => false);
			setGhostsMoving(() => false);
		}
	}, [playerPosition]);

	return (
		<>
			<div style={playgroundStyle}>
				<Player
					playerDirection={playerDirection}
					playerPosition={playerPosition}
					playgroundSettings={playgroundSettings}
				/>
				<Ghost
					ghostPosition={ghostPosition}
					playgroundSettings={playgroundSettings}
				/>
				{foodPosition.map((singleFood, i) => {
					const style = {
						position: 'absolute',
						top: `${singleFood.y}px`,
						left: `${singleFood.x}px`,
						border: '1px solid red',
						display: 'inline-block',
						transform: 'translate(15px, 10px)'
					};
					return <div key={i} style={style}></div>;
				})}
			</div>
			<p>Score: {score}</p>
		</>
	);
};

export default Taskhandler;
