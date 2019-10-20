import React from 'react'

const Player = (props) => {

	const playerStyle = {
		position: 'absolute',
		width: '30px',
		height: 'auto',
		top: `${props.playerPosition.y}px`,
		left: `${props.playerPosition.x}px`,
		// transition: `all ${props.playgroundSettings.tickrate/1000}s linear`,
	}

	return (
		<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/512px-React-icon.svg.png" alt="Player" style={playerStyle} />
	)
}

export default Player