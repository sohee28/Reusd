import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import "../Styles/EditProduct.css";

import FileUploadError from "../Components/FileUploadError";
import axios from "axios";
import { Context } from "./../App";

const EditProduct: React.FC = (props: any) => {
  const [createdAt, setCreatedAt] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [images, setImages] = React.useState([]);
  const { token, intervalId, intervalStatus, isSignedIn } = React.useContext(
    Context
  );
  const [tokens, setToken] = token;
  React.useEffect(() => {
    const getItems = async () => {
      let _id = JSON.stringify(props.location.state);
      let id = JSON.parse(_id)["itemid"];
      const data = await axios.get(`http://localhost:5000/item/${id}`, {
        headers: {
          Authorization: "Bearer " + tokens,
        },
        withCredentials: true,
        validateStatus: () => true,
      });
      if (data.status === 200) {
        const { createdAt, description, image, price, title } = data.data;
        setImages(image);
        setCreatedAt(createdAt);
        setDescription(description);
        setPrice(price);
        setTitle(title);
      } else {
        console.log("Edit error!");
      }
    };

    getItems();
  }, []);

  const handlingSubmit = async (
    e: React.MouseEvent<HTMLElement>
  ): Promise<void> => {
    e.preventDefault();
    console.log("it is here!");
    let _id = JSON.stringify(props.location.state);
    let id = JSON.parse(_id)["itemid"];
    const Item = {
      image: images,
      title: title,
      price: price,
      description: description,
    };
    const data = await axios.put(`http://localhost:5000/item/${id}`, Item, {
      headers: {
        Authorization: "Bearer " + tokens,
      },
      withCredentials: true,
      validateStatus: () => true,
    });
    if (data.status === 200) {
      props.history.push("/SellingHistory");
    } else {
      alert("Failed to update the item! ");
    }
  };

  const updateImages = (newImages: any) => {
    setImages(newImages);
  };

  return (
    <form className="Editproductpage">
      <div className="edit-product-input-list">
        <FileUploadError images={images} updateImages={updateImages} />
        <div className="edit-product-inputlist-area">
          <div className="edit-product-inputlist-title">
            <p className="edit-product-input-item">TITLE</p>
            <input
              className="edit-input"
              type="text"
              autoFocus
              required
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setTitle(e.target.value);
              }}
            />
          </div>
          <div className="edit-product-inputlist-price">
            <p className="edit-product-input-item">PRICE</p>
            <div className="edit-input-price-container">
              <FontAwesomeIcon className="dollarsign" icon={faDollarSign} />
              <input
                className="edit-input-price"
                type="text"
                autoFocus
                required
                value={price}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPrice(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="edit-product-inputlist-description">
            <p className="edit-product-input-item">DESCRIPTION</p>
            <textarea
              wrap="soft"
              className="edit-input-description"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setDescription(e.target.value);
              }}
            ></textarea>
          </div>
        </div>
      </div>
      <div className="edit-product-btn-area">
        <button onClick={handlingSubmit} className="edit-product-btn">
          SUBMIT
        </button>
      </div>
    </form>
  );
};

export default EditProduct;
