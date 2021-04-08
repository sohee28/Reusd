import * as React from "react";
import queryString from "query-string";
import io from "socket.io-client";
import closeIcon from "../../img/icons/closeIcon.png";
import onlineIcon from "../../img/icons/onlineIcon.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Message from "./Message";
import "../../Styles/Chat.css";
import { Context } from "../../App";
import axios from "axios";

let socket: any;

const Chat: React.FC = ({ location }: any) => {
  const { token, isSignedIn } = React.useContext(Context);
  const [tokens, setTokens] = token;
  const [name, setName] = React.useState("");
  const [room, setRoom] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<Boolean>(true);

  const [title, setTitle] = React.useState("");

  const ENDPOINT = "http://localhost:5001";

  const settingChat = async ({ name, room, opponent, itemid }: any) => {
    const chat = { buyer: name, room: room, seller: opponent, itemid: itemid };
    const chatt = await axios.post(`http://localhost:5000/setChat`, chat, {
      headers: {
        Authorization: "Bearer " + tokens,
      },
      withCredentials: true,
      validateStatus: () => true,
    });
    if (chatt.status === 200) {
      console.log("it worked!");
    } else {
      console.log("error");
    }
  };

  const getMessageHistory = async (room: any) => {
    const messagehistory = await axios.get(
      `http://localhost:5001/get/${room}`,
      {
        withCredentials: true,
        validateStatus: () => true,
      }
    );
    if (messagehistory.status === 200) {
      setLoading(true);
      let temp = [...messages];
      messagehistory.data.messages.forEach((element: any) => {
        const txt = element.message;
        const user = element.user.name;
        const msg = { text: txt, user };
        temp = temp.concat(msg);
      });
      setMessages(temp);
      setLoading(false);
    } else {
      return null;
    }
  };

  React.useEffect(() => {
    const datas: any = queryString.parse(location.search);
    socket = io(ENDPOINT);
    const { name, room, createdBy, itemid } = datas;
    setName(name);
    setRoom(room);

    settingChat({
      name: name,
      room: room,
      opponent: createdBy,
      itemid: itemid,
    });

    socket.emit("join", { name, room }, () => {});
    getMessageHistory(room);
    setTitle(itemid);
    return () => {
      socket.emit("dc", { name });
      socket.off();
    };
  }, []);

  React.useEffect(() => {
    socket.on("message", (message: any) => {
      setMessages([...messages, message]);
    });
  }, [messages]);

  const sendMessage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };
  return (
    <div className="Chat">
      <div className="chat-container">
        <div className="infoBar">
          <div className="leftInnerContainer">
            <p className="leftInnerContainer-p">{title}</p>
          </div>
          <div className="rightInnerContainer">
            <a className="rightInnerContainer-a" href="/">
              <FontAwesomeIcon
                icon={faTimes}
                style={{ color: "white", backgroundColor: "#ed5237" }}
              />
            </a>
          </div>
        </div>
        {!loading ? (
          <div style={{ backgroundColor: "white" }}>
            {messages.map((message, i) => (
              <div key={i}>
                <Message text={message.text} user={message.user} name={name} />
              </div>
            ))}
          </div>
        ) : null}
        <form className="form">
          <input
            className="input"
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setMessage(e.target.value)
            }
            onKeyPress={(e) => (e.key === "Enter" ? sendMessage : null)}
          />
          <button className="sendButton" onClick={sendMessage}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
