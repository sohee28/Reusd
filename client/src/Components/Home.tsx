import * as React from "react";
import "../Styles/Home.css";
import axios from "axios";
import ImageSlider from "./utils/ImageSliderHome";
import moment from "moment";

const Home: React.FC = (props: any) => {
  const [Items, setItems] = React.useState([]);
  const [tempItems, setTempItems] = React.useState<any[]>([]);
  const [searchItem, setSearchItem] = React.useState("");
  const [newestSort, setNewestSort] = React.useState({
    boxshadow: "inset 5px 5px 6px #cecece, inset -5px -5px 6px #ffffff",
  });
  const [priceSort, setPriceSort] = React.useState({
    boxshadow: "5px 5px 6px #cecece, -5px -5px 6px #ffffff",
  });
  React.useEffect(() => {
    const getItems = async () => {
      console.log("not logged in!");
      const items = await axios.get(`http://localhost:5000/item/`, {
        withCredentials: true,
        validateStatus: () => true,
      });
      if (items.status === 200) {
        let itemsdata = items.data.filter(
          (item: any) => item.status !== "Sold"
        );
        console.log(itemsdata);
        setItems(itemsdata);
        setTempItems(itemsdata);
      } else {
        console.log("error!");
      }
    };
    getItems();
  }, []);

  const handleSearchbarSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setTempItems(
        Items.filter((data: any) =>
          data.title.toLowerCase().includes(searchItem)
        )
      );
      setSearchItem("");
    }
  };

  const HandleItemClick = (itemid: any) => {
    props.history.push({
      pathname: "/DetailProduct",
      state: { itemid: itemid },
    });
  };

  const handleNewestSort = () => {
    setNewestSort({
      boxshadow: "inset 5px 5px 6px #cecece, inset -5px -5px 6px #ffffff",
    });
    setPriceSort({
      boxshadow: "5px 5px 6px #cecece, -5px -5px 6px #ffffff",
    });
    setTempItems(
      tempItems
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
        .reverse()
    );
  };

  const handlePriceSort = () => {
    setNewestSort({
      boxshadow: "5px 5px 6px #cecece, -5px -5px 6px #ffffff",
    });
    setPriceSort({
      boxshadow: "inset 5px 5px 6px #cecece, inset -5px -5px 6px #ffffff",
    });
    setTempItems(tempItems.sort((a, b) => a.price - b.price));
  };

  return (
    <div className="home">
      <div className="search-form">
        <input
          className="search-bar"
          type="search"
          value={searchItem}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchItem(e.target.value);
          }}
          onKeyUp={handleSearchbarSubmit}
        />
      </div>
      <div className="sort-tab">
        <button
          onClick={handleNewestSort}
          style={{
            boxShadow: newestSort.boxshadow,
          }}
          className="sort-item newest"
        >
          Newest
        </button>
        <button
          onClick={handlePriceSort}
          style={{
            boxShadow: priceSort.boxshadow,
          }}
          className="sort-item price"
        >
          Price
        </button>
      </div>
      <div className="main-container">
        <ul className="item-card">
          {tempItems &&
            tempItems.map((item: any, index) => (
              <ol
                className="item-list"
                key={index}
                onClick={(
                  e: React.MouseEvent<HTMLOListElement, MouseEvent>
                ) => {
                  HandleItemClick(item._id);
                }}
              >
                <div className="item-image-card">
                  <ImageSlider images={item.image} />
                </div>
                <div className="item-info-container">
                  <div className="item-info">
                    <p className="item-title">{item.title.toUpperCase()}</p>
                    <p className="item-createdAt">
                      {moment(new Date(item.createdAt))
                        .parseZone()
                        .startOf("seconds")
                        .fromNow()}
                    </p>
                    <p className="item-price">${item.price}</p>
                  </div>
                  <div className="item-status">
                    <p className="item-status-text">{item.status}</p>
                  </div>
                </div>
              </ol>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
