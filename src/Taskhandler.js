import React, { useState, useEffect, } from 'react';
import Player from './Player';
import useInterval from './helpers/useInterval'

const Taskhandler = () => {
	const [playerDirection, setPlayerDirection] = useState('');
	const [playerMoving, setPlayerMoving] = useState(false);
	const [playerPosition, setPlayerPosition] = useState({
		x: 0,
		y: 0
	});

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

		if (!playerMoving && (up || down || left || right)) setPlayerMoving(() => true);
	};

	useEffect(() => {
		document.addEventListener('keydown', handleKeydown);

		return () => document.removeEventListener('keydown', handleKeydown);
	}, []);

	useEffect(() => {
		console.log(playerMoving ? 'moving' : 'stopped');
	}, [playerMoving]);

	useInterval(() => {
		if (playerMoving) {
			if (!playerDirection) return;

			if (playerDirection === 'left') {
				setPlayerPosition(prevPos => {
					return {
						x: prevPos.x - 10,
						y: prevPos.y
					};
				});
			}

			if (playerDirection === 'up') {
				setPlayerPosition(prevPos => {
					return {
						x: prevPos.x,
						y: prevPos.y - 10
					};
				});
			}

			if (playerDirection === 'down') {
				setPlayerPosition(prevPos => {
					return {
						x: prevPos.x,
						y: prevPos.y + 10
					};
				});
			}

			if (playerDirection === 'right') {
				setPlayerPosition(prevPos => {
					return {
						x: prevPos.x + 10,
						y: prevPos.y
					};
				});
			}
		}
	}, 100);

	const playgroundStyle = {
		position: 'relative',
		width: '400px',
		height: '400px',
		border: '1px solid black'
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
