import React from 'react';

const Countdown = ({ title }: { title: string }) => {
    return (
        <div>
            <h1>{title}</h1>
        </div>
    );
};

Countdown.schema = {
    title: 'Countdown',
    type: 'object',
    properties: {
        title: { type: 'string' },
    },
};

export default Countdown;