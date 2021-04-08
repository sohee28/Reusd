import * as React from "react";
import axios from "axios";
import { Context } from "./../App";
import "../Styles/Myinfo.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTemperatureHigh } from "@fortawesome/free-solid-svg-icons";
import { faTemperatureLow } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const MyInfo: React.FC = () => {
  const { token } = React.useContext(Context);
  const [tokens, setToken] = token;
  const [city, setCity] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [state, setState] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [rateTotal, setRateTotal] = React.useState(0);
  const [item, setitem] = React.useState([]);

  React.useEffect(() => {
    const getItems = async () => {
      const userinfo = await axios.get("http://localhost:5000/userinfo", {
        headers: {
          Authorization: "Bearer " + tokens,
        },
        withCredentials: true,
        validateStatus: () => true,
      });
      if (userinfo.status === 200) {
        const {
          city,
          country,
          email,
          firstName,
          lastName,
          state,
          item,
          rateTotal,
        } = userinfo.data;
        setRateTotal(rateTotal);
        setCity(city);
        setCountry(country);
        setEmail(email);
        setFirstName(firstName);
        setLastName(lastName);
        setState(state);
        setitem(item);
      } else {
        console.log("errrorrrr! ");
      }
    };
    getItems();
  }, [tokens]);
  return (
    <div>
      <div className="MyInfo">
        <div className="MyInfo-area">
          <div className="MyInfo-name">
            <p className="MyInfo-name-name">
              {firstName.toUpperCase() + " " + lastName.toUpperCase()}
            </p>
            <p
              className="MyInfo-rate"
              style={{ color: rateTotal < 3 ? "blue" : "#ed5237" }}
            >
              {rateTotal < 3 ? (
                <FontAwesomeIcon
                  icon={faTemperatureLow}
                  style={{ color: "blue", fontSize: "20px" }}
                />
              ) : (
                <FontAwesomeIcon
                  style={{ color: "#ed5237", fontSize: "20px" }}
                  icon={faTemperatureHigh}
                />
              )}
              {rateTotal}/5
            </p>
          </div>
          <p className="MyInfo-email">{email}</p>
          <p className="MyInfo-country">
            COUNTRY : <span style={{ fontWeight: 400 }}>{country}</span>
          </p>
          <p className="MyInfo-state">
            STATE : <span style={{ fontWeight: 400 }}>{state}</span>
          </p>
          <p className="MyInfo-city">
            CITY : <span style={{ fontWeight: 400 }}>{city}</span>
          </p>
          <div className="MyInfo-btn">
            <Link
              style={{ textDecoration: "none" }}
              to={{
                pathname: "/EditMyInfo",
              }}
            >
              <button className="MyInfo-edit-btn">EDIT PROFILE</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyInfo;
