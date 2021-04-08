import React from "react";
import axios from "axios";
import "../../Styles/Message.css";

const Message: React.FC<{
  user: String;
  text: String;
  name: String;
}> = (props: { user: String; text: String; name: String }) => {
  const { user, text, name } = props;

  let isSentByCurrentUser = false;
  const trimmedName = name.trim().toLowerCase();

  if (user === trimmedName) {
    isSentByCurrentUser = true;
  }

  return isSentByCurrentUser ? (
    <div className="messageContainer justifyEnd">
      <div className="messageBox backgroundBlue">
        <p className="messageText colorWhite">{text}</p>
      </div>
    </div>
  ) : (
    <div className="messageContainer justifyStart">
      <div className="messageBox backgroundLight">
        <p className="messageText colorDark">{text}</p>
      </div>
    </div>
  );
};

export default Message;
