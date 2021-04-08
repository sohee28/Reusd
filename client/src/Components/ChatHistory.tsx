import * as React from "react";
import axios from "axios";
import { Context } from "./../App";
import { Link } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import "../Styles/ChatHistory.css";

const ChatHistory: React.FC = (props: any) => {
  const { token, isSignedIn } = React.useContext(Context);
  const [tokens, setTokens] = token;
  const [chatHistory, setChatHisotry] = React.useState<any>([]);
  const [Items, setItems] = React.useState<any>([]);

  const [id, setId] = React.useState("");

  React.useEffect(() => {
    const getUserInfo = async () => {
      const userinfo = await axios.get("http://localhost:5000/userid", {
        headers: {
          Authorization: "Bearer " + tokens,
        },
        withCredentials: true,
        validateStatus: () => true,
      });
      if (userinfo.status === 200) {
        const { id } = userinfo.data;
        setId(id);
      } else {
        console.log("errrorrrr! ");
      }
    };

    const getItems = async () => {
      const chathistory = await axios.get("http://localhost:5000/chathistory", {
        headers: {
          Authorization: "Bearer " + tokens,
        },
        withCredentials: true,
        validateStatus: () => true,
      });
      if (chathistory.status === 200) {
        setChatHisotry(chathistory.data);
      } else {
        console.log("errrorrrr! ");
      }
    };
    getItems();
    getUserInfo();
  }, []);

  return (
    <div className="ChatHistory">
      <div className="ChatHistory-table-section">
        <TableContainer className="tableContainer">
          <Table className="table" aria-label="simple table">
            <TableHead className="tablehead">
              <TableRow className="tablerow">
                <TableCell className="table-title-title" align="center">
                  Number
                </TableCell>
                <TableCell className="table-title-title" align="center">
                  Item
                </TableCell>
                <TableCell
                  align="center"
                  style={{ color: "white" }}
                ></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {chatHistory.map((chat: any, index: number) => (
                <TableRow key={index} className="status-tablerow">
                  <TableCell align="center">
                    <ol>{index + 1}</ol>
                  </TableCell>
                  <TableCell align="center">
                    <ol>{chat.itemid}</ol>
                  </TableCell>
                  <TableCell align="center">
                    <Link
                      style={{ textDecoration: "none" }}
                      to={`/Chat?name=${id}&room=${chat.room}&createdBy=${chat.seller}&itemid=${chat.itemid}`}
                    >
                      <button className="chathistory-btn"> Chat</button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
export default ChatHistory;
