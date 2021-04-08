import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faDatabase } from "@fortawesome/free-solid-svg-icons";
import { Context } from "./../App";
import axios from "axios";
import "../Styles/EditMyInfo.css";

const EditMyInfo: React.FC = (props: any) => {
  const { token, isSignedIn } = React.useContext(Context);
  const [tokens, setTokens] = token;
  const [countries, setCountries] = React.useState([]);
  const [states, setStates] = React.useState([]);
  const [cities, setCities] = React.useState([]);
  const [userInfo, setUserInfo] = React.useState({
    firstName: "",
    lastName: "",
    country: "",
    state: "",
    city: "",
    email: "",
  });
  console.log(userInfo);

  React.useEffect(() => {
    const getCountries = async () => {
      const country = await axios.get("http://localhost:5000/getCountries", {
        withCredentials: true,
        validateStatus: () => true,
      });
      if (country.status === 200) {
        let countrydata = country.data;
        setCountries(countrydata);
      } else {
        console.log("error");
      }
    };

    const getItems = async () => {
      const data = await axios.get(`http://localhost:5000/userinfo`, {
        headers: {
          Authorization: "Bearer " + tokens,
        },
        withCredentials: true,
        validateStatus: () => true,
      });
      if (data.status === 200) {
        const {
          city,
          country,
          email,
          firstName,
          lastName,
          state,
          item,
          rateTotal,
        } = data.data;
        setUserInfo({
          ...userInfo,
          city: city,
          country: country,
          email: email,
          firstName: firstName,
          lastName: lastName,
          state: state,
        });
      } else {
        console.log("errrorrrr! ");
      }
    };

    getItems();
    getCountries();
  }, []);

  //When country is selected
  const handleCountryChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    e.preventDefault();
    const country = await axios.get(
      `http://localhost:5000/Country/${e.target.value}`,
      {
        withCredentials: true,
        validateStatus: () => true,
      }
    );
    if (country.status === 200) {
      let countrydata = country.data;
      setUserInfo({ ...userInfo, country: countrydata[0].name });
      const states = await axios.get(
        `http://localhost:5000/getStates/${countrydata[0].id}`,
        {
          withCredentials: true,
          validateStatus: () => true,
        }
      );
      if (states.status === 200) {
        let statesdata = states.data;
        setStates(statesdata);
      } else {
        console.log("error!");
      }
    } else {
      console.log("error!");
    }
  };

  //When state is selected
  const handleStateChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const state = await axios.get(
      `http://localhost:5000/State/${e.target.value}`,
      {
        withCredentials: true,
        validateStatus: () => true,
      }
    );
    if (state.status === 200) {
      let statedata = state.data;
      setUserInfo({ ...userInfo, state: statedata[0].name });
      const cities = await axios.get(
        `http://localhost:5000/getCities/${statedata[0].id}`,
        {
          withCredentials: true,
          validateStatus: () => true,
        }
      );
      if (cities.status === 200) {
        let citiesdata = cities.data;
        setCities(citiesdata);
      } else {
        console.log("error!");
      }
    } else {
      console.log("error!");
    }
  };

  //When city is selected
  const handleCityChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const city = await axios.get(
      `http://localhost:5000/City/${e.target.value}`,
      {
        withCredentials: true,
        validateStatus: () => true,
      }
    );
    if (city.status === 200) {
      let citydata = city.data;
      setUserInfo({ ...userInfo, city: citydata[0].name });
    } else {
      console.log("error!");
    }
  };

  const handleInfoEdit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const data = await axios.put(
      "http://localhost:5000/edituserinfo",
      userInfo,
      {
        headers: {
          Authorization: "Bearer " + tokens,
        },
        withCredentials: true,
        validateStatus: () => true,
      }
    );
    if (data.status === 200) {
      props.history.push("/MyInfo");
    } else {
    }
  };

  return (
    <form onSubmit={handleInfoEdit} className="EditMyInfo">
      <div className="EditMyInfoInputSection">
        <input
          className="EditMyInfo-input"
          type="text"
          autoFocus
          required
          value={userInfo.firstName}
          placeholder="First Name"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setUserInfo({ ...userInfo, firstName: e.target.value });
          }}
        />
        <input
          className="EditMyInfo-input"
          type="text"
          autoFocus
          required
          value={userInfo.lastName}
          placeholder="Last Name"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setUserInfo({ ...userInfo, lastName: e.target.value });
          }}
        />
        <input
          className="EditMyInfo-input"
          type="email"
          autoFocus
          required
          value={userInfo.email}
          placeholder="Email Address"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setUserInfo({ ...userInfo, email: e.target.value });
          }}
        />

        <select className="EditMyInfo-select" onChange={handleCountryChange}>
          {countries &&
            countries.map((country: any, index) => (
              <option
                className="EditMyInfo-select-option"
                key={index}
                value={country.id}
              >
                {country.name}
              </option>
            ))}
        </select>
        <select
          defaultValue={userInfo.state}
          className="EditMyInfo-select"
          onChange={handleStateChange}
        >
          {states &&
            states.map((state: any, index) => (
              <option
                className="EditMyInfo-select-option"
                key={index}
                value={state.id}
              >
                {state.name}
              </option>
            ))}
        </select>
        <select className="EditMyInfo-select" onChange={handleCityChange}>
          {cities &&
            cities.map((city: any, index) => (
              <option
                className="EditMyInfo-select-option"
                key={index}
                value={city.id}
              >
                {city.name}
              </option>
            ))}
        </select>
        <button type="submit" className="EditMyInfo-submitbtn">
          <FontAwesomeIcon icon={faCheck} />
        </button>
      </div>
    </form>
  );
};

export default EditMyInfo;
