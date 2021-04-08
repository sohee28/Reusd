import * as React from "react";
import axios from "axios";
import "../Styles/DetailProduct.css";
import { Link } from "react-router-dom";
import ImageSliderDetail from "./utils/ImageSliderDetail";
import moment from "moment";
import { Context } from "./../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTemperatureHigh } from "@fortawesome/free-solid-svg-icons";
import { faTemperatureLow } from "@fortawesome/free-solid-svg-icons";
import StarRating from "react-svg-star-rating";
import { createDiffieHellman } from "crypto";

const DetailProduct: React.FC = (props: any) => {
  const [createdAt, setCreatedAt] = React.useState("");
  const [createdBy, setCreatedBy] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [images, setImages] = React.useState([]);
  const [status, setStatus] = React.useState("");
  const [firstName, setfirstName] = React.useState("");
  const [lastName, setlastName] = React.useState("");
  const [country, setcountry] = React.useState("");
  const [state, setstate] = React.useState("");
  const [city, setcity] = React.useState("");
  const [userId, setuserId] = React.useState("");
  const [rateTotal, setRateTotal] = React.useState(0);
  const [name, setName] = React.useState("");
  const [room, setRoom] = React.useState("");
  const [itemid, setItemid] = React.useState("");

  const [rate, setRate] = React.useState({
    rate: 0,
    seller: "",
  });

  const { token } = React.useContext(Context);
  const [tokens, setToken] = token;

  React.useEffect(() => {
    const getDetailedItem = async (createdBy: any) => {
      const itemdata = await axios.get(
        `http://localhost:5000/userinfo/${createdBy}`,
        {
          headers: {
            Authorization: "Bearer " + tokens,
          },
          withCredentials: true,
          validateStatus: () => true,
        }
      );
      if (itemdata.status === 200) {
        const { id } = itemdata.data;
        const {
          firstName,
          lastName,
          country,
          state,
          city,
          rateTotal,
        } = itemdata.data.result;
        setRateTotal(rateTotal);
        setuserId(id);
        setRoom(createdBy + id);
        setName(id);
        setfirstName(firstName);
        setlastName(lastName);
        setcountry(country);
        setstate(state);
        setcity(city);
      } else {
        console.log("Error");
      }
    };

    const getItems = async () => {
      let _id = JSON.stringify(props.location.state);
      let id = JSON.parse(_id)["itemid"];
      console.log(id);
      setItemid(id);
      const data = await axios.get(`http://localhost:5000/item/${id}`, {
        headers: {
          Authorization: "Bearer " + tokens,
        },
        withCredentials: true,
        validateStatus: () => true,
      });

      if (data.status === 200) {
        const {
          createdAt,
          createdBy,
          description,
          image,
          price,
          title,
          status,
        } = data.data;
        getDetailedItem(createdBy);
        setCreatedBy(createdBy);
        setRoom(createdBy);
        setImages(image);
        setCreatedAt(createdAt);
        setDescription(description);
        setPrice(price);
        setTitle(title);
        setStatus(status);
      } else {
        console.log("error!");
      }
    };
    getItems();
  }, []);

  const handleRating = async (ratingvalue: number) => {
    setRate({ rate: ratingvalue, seller: createdBy });
  };

  React.useEffect(() => {
    const Ratings = async () => {
      const data = await axios.post(`http://localhost:5000/rateuser`, rate, {
        headers: {
          Authorization: "Bearer " + tokens,
        },
        withCredentials: true,
        validateStatus: () => true,
      });
      if (data.status === 200) {
        console.log("it worked!");
      } else {
        console.log("error!");
      }
    };
    if (rate.seller !== "") {
      Ratings();
    }
  }, [handleRating]);

  return (
    <div className="DetailProduct">
      <div className="Product-image-area">
        <ImageSliderDetail images={images} />
      </div>
      <div className="Product-userinfo-area">
        <div className="Product-userinfo-name-location">
          <div className="Product-userinfo-name-rate">
            <p className="Product-userinfo-name">
              {firstName.toUpperCase() + " " + lastName.toUpperCase()}
            </p>
            <p
              className="Product-userinfo-rate"
              style={{ color: rateTotal < 3 ? "blue" : "#ed5237" }}
            >
              {rateTotal < 3 ? (
                <FontAwesomeIcon
                  icon={faTemperatureLow}
                  style={{ color: "blue", fontSize: "15px" }}
                />
              ) : (
                <FontAwesomeIcon
                  style={{ color: "#ed5237", fontSize: "15px" }}
                  icon={faTemperatureHigh}
                />
              )}
              {rateTotal}/5
            </p>
          </div>
          <p className="Product-userinfo-location">
            {city + ", " + state + ", " + country}
          </p>
        </div>
        {userId !== createdBy ? (
          <div className="Product-userinfo-rating-chat-area">
            <div className="Product-userinfo-rating">
              <p style={{ fontSize: "14px" }}>How was this seller?</p>
              <StarRating size={22} handleOnClick={handleRating} />
            </div>
            <div className="Product-userinfo-startchat-area">
              <Link
                style={{ textDecoration: "none" }}
                to={`/Chat?name=${name}&room=${room}&createdBy=${createdBy}&itemid=${title}`}
              >
                <button className="Product-userinfo-startchat">
                  Start Chat
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="Product-userinfo-rating-chat-area">
            <div
              style={{ width: "7rem" }}
              className="Product-userinfo-rating"
            ></div>
            <div
              style={{ width: "7rem" }}
              className="Product-userinfo-startchat-area"
            ></div>
          </div>
        )}
      </div>
      <p className="hrline"></p>
      <div className="Product-detailinfo-area">
        <p className="Product-detail-title-area">{title.toUpperCase()}</p>
        <p className="Product-detail-createdAt-area">
          {moment(createdAt).format("MMMM Do YYYY, h:mm:ss a")}
        </p>
        <p className="Product-detail-price-area">$ {price}</p>
        <p className="Product-detail-description-area">{description}</p>
      </div>
    </div>
  );
};

export default DetailProduct;
