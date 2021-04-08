import * as React from "react";
import axios from "axios";
import "../Styles/FileUpload.css";
import { Context } from "./../App";

interface ChildProps {
  updateImages: (newImages: any) => void;
}

const FileUpload: React.FC<ChildProps> = (props) => {
  const [Files, setFiles] = React.useState<any>([]);
  const { token, intervalId, intervalStatus, isSignedIn } = React.useContext(
    Context
  );
  const [tokens, setToken] = token;

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];

    let formData = new FormData();

    formData.append("MyImg", file);
    const data = await axios.post(
      "http://localhost:5000/uploadImage",
      formData,
      {
        headers: {
          Authorization: "Bearer " + tokens,
        },
        withCredentials: true,
        validateStatus: () => true,
      }
    );
    if (data.status === 200) {
      setFiles([...Files, data.data.image]);
      props.updateImages([...Files, data.data.image]);
    } else {
      alert("Failed to upload the img");
    }
  };

  const onDelete = async (filename: any): Promise<void> => {
    const currentIndex = Files.indexOf(filename);

    const data = await axios.delete(`http://localhost:5000/photo/${filename}`, {
      withCredentials: true,
      validateStatus: () => true,
    });
    if (data.status === 200) {
      console.log("Image succesfully deleted");
    } else {
      alert("Failed to delete the image");
    }

    let newFiles = [...Files];
    newFiles.splice(currentIndex, 1);

    setFiles(newFiles);
    props.updateImages(newFiles);
  };

  return (
    <div className="file-upload">
      <div className="sell-product-inputlist-image">
        <div className="file-button">
          <label className="file-label">
            <input
              className="image-field"
              type="file"
              name="photo"
              onChange={handleImage}
              accept="image/png, image/jpeg"
              required
            ></input>
            <span className="plus-sign">+</span>
          </label>
        </div>
      </div>
      <div className="PreviewFileArea">
        {Files.map((filename: any) => (
          <div
            onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
              onDelete(filename);
            }}
          >
            <img
              className="previewImage"
              src={`http://localhost:5000/${filename}`}
              alt={`${filename}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUpload;
