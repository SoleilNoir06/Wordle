import React from 'react';

const Message = ({ message }) => {
    return message ? <div className="message">{message}</div> : null;
};

export default Message;