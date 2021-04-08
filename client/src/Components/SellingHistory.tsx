import * as React from "react";
import "../Styles/SellingHistory.css";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { Context } from "./../App";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const SellingHistory: React.FC = () => {
  const { token } = React.useContext(Context);
  const [tokens, setToken] = token;
  const [Items, setItems] = React.useState([]);
  const [status, setStatus] = React.useState("Selling");

  React.useEffect(() => {
    const getItems = async () => {
      const useritem = await axios.get("http://localhost:5000/useritem", {
        headers: {
          Authorization: "Bearer " + tokens,
        },
        withCredentials: true,
        validateStatus: () => true,
      });
      if (useritem.status === 200) {
        setItems(useritem.data);
      } else {
        console.log("errrorrrr! ");
      }
    };
    getItems();
  }, []);

  const handleDelete = async (_id: string): Promise<void> => {
    const data = await axios.delete(`http://localhost:5000/item/${_id}`, {
      headers: {
        Authorization: "Bearer " + tokens,
      },
      withCredentials: true,
      validateStatus: () => true,
    });
    if (data.status === 200) {
      window.location.reload();
    } else {
      alert("Failed to delete the item");
    }
  };

  const handleStatus = async (itemid: any, itemstatus: string, target: any) => {
    const value = target.value;
    setStatus(value);
    const status = { status: value };
    const data = await axios.put(
      `http://localhost:5000/itemstatus/${itemid}`,
      status,
      {
        headers: {
          Authorization: "Bearer " + tokens,
        },
        withCredentials: true,
        validateStatus: () => true,
      }
    );
    if (data.status === 200) {
      console.log("worked");
    } else {
      alert("Failed to update! ");
    }
  };

  return (
    <div className="SellingHistory">
      <div className="SellingHistory-table-section">
        <h1 className="sellinghistory-title">SELLING HISTORY</h1>
        <TableContainer className="tableContainer">
          <Table className="table" aria-label="simple table">
            <TableHead className="tablehead">
              <TableRow className="tablerow">
                <TableCell className="table-title-title" align="left">
                  Title
                </TableCell>
                <TableCell align="left">Price</TableCell>
                <TableCell align="left">Status</TableCell>
                <TableCell align="left"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Items.map((item: any, index: number) => (
                <TableRow key={index} className="status-tablerow">
                  <TableCell
                    align="left"
                    style={{
                      textDecorationLine:
                        item.status === "Sold" ? "line-through" : "none",
                      textDecorationColor:
                        item.status === "Sold" ? "red" : "none",
                    }}
                  >
                    {item.title.toUpperCase()}
                  </TableCell>
                  <TableCell align="left">{item.price}</TableCell>
                  <TableCell className="status-section" align="left">
                    <select
                      defaultValue={item.status}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        handleStatus(
                          item._id,
                          item.status,
                          e.target as HTMLElement
                        );
                      }}
                      className="status-select"
                    >
                      <option
                        className="selling-selling-history-btn"
                        value="Selling"
                      >
                        Selling
                      </option>
                      <option
                        className="reserved-selling-history-btn"
                        value="Reserved"
                      >
                        Reserved
                      </option>
                      <option className="sold-selling-history-btn" value="Sold">
                        Sold
                      </option>
                    </select>
                  </TableCell>
                  <TableCell className="edit-delete" align="left">
                    <Link
                      style={{ textDecoration: "none" }}
                      to={{
                        pathname: "/EditProduct",
                        state: { itemid: item._id },
                      }}
                    >
                      <button className="edit-selling-history-btn">
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                    </Link>

                    <button
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        handleDelete(item._id);
                      }}
                      className="delete-selling-history-btn"
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
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

export default SellingHistory;
