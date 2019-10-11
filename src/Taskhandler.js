import React, { useState, useEffect } from 'react';
import Player from './Player';
import useInterval from './helpers/useInterval';

const Taskhandler = () => {
	const [playerDirection, setPlayerDirection] = useState('');
	const [playerMoving, setPlayerMoving] = useState(false);
	const [playerPosition, setPlayerPosition] = useState({
		x: 0,
		y: 0
	});

	const playgroundSettings = {
		width: 400,
		height: 400,
		tickrate: 100,
		speed: 10,
		foodPosition: [],
		generateFood() {
			this.foodPosition.push({x: 0, y: 0})
			console.log(this.foodPosition)
		}
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
		document.addEventListener('keydown', handleKeydown);

		playgroundSettings.generateFood()

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

	return (
		<div style={playgroundStyle}>
			<Player
				playerDirection={playerDirection}
				playerPosition={playerPosition}
			/>
		</div>
	);
};

export default Taskhandler;
