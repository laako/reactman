import React from 'react'

const Ghost = (props) => {
    const ghostStyle = {
        position: 'absolute',
        top: `${props.ghostPosition.y}px`,
        left: `${props.ghostPosition.x}px`,
        transition: `all ${props.playgroundSettings.tickrate/1000}s linear`,
    }
    return (
        <img alt=" " style={ghostStyle} />
    )
}

export default Ghost