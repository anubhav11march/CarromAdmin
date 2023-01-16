import React, { useEffect, useState } from "react";
import {
  AddChatOption,
  AddCoupon,
  AddDeposit,
  AddWithdrawal,
  DeleteChat,
  DeleteCoupon,
  DeleteDeposit,
  DeleteWithdrawal,
  GetControl,
  UpdateControls,
  FetchSocialLinks,
  AddSocialLink,
  UpdateSocialLink,
  DeleteSocialLink,
  AddNotification,
  DeleteNotification,
  FetchNotifications,
} from "../../api";
import { Spinner, Toast } from "react-bootstrap";
import Modal from "react-modal";
import { AiFillEdit, AiOutlineClose, AiOutlineDelete } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import NoImage from "../../assests/no-image.jpg";
import "./control.css";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    background: "#FFFFFF",
    border: "1px solid #00000099",
    borderRadius: "10px",
    width: "400px",
  },
};

const Control = () => {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [modalIsOpen1, setIsOpen1] = React.useState(false);
  const [modalIsOpen2, setIsOpen2] = React.useState(false);
  const [modalIsOpen3, setIsOpen3] = React.useState(false);
  const [modalIsOpen4, setIsOpen4] = React.useState(false);
  const [modalIsOpen5, setIsOpen5] = React.useState(false);
  const [notificationData, setNotificationData] = useState([]);
  const [img, setImg] = React.useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [input, setInput] = React.useState({
    deposit: "",
    withdawal: "",
    mobileNumber: "",
  });
  const [inputChat, setInputChat] = React.useState({ option: "" });
  const [fileDeposit, setFileDeposit] = React.useState();
  const [fileWithdrawal, setFileWithdrawal] = React.useState();
  const [inputCoupon, setInputCoupon] = React.useState({
    name: "",
    amountCredit: "",
    cashback: "",
    Terms: "",
  });
  const [controlData, setControlData] = React.useState({
    depositNumber: "",
    withdawalNumber: "",
    CaromWin: 0,
    minDeposit: 0,
    maxDeposit: 0,
    minWithdawal: 0,
    maxWithdawal: 0,
    depositMethods: [],
    withdawalMethods: [],
    chatLink: "",
    chatOptions: [],
    coupons: [],
    CaromWin: 0,
    SpinWin: 0,
  });

  const [loading, setLoading] = useState(false);
  const [view, setView] = useState(false);
  const [state, setState] = useState("AddSocialLink");
  const [socialLinks, setSocialLinks] = useState([]);
  const [newLink, setNewLink] = useState({
    name: "",
    link: "",
    image: "",
  });
  const [notification, setNotification] = useState({
    title: "",
    description: "",
  });
  //TODO:send Notification

  const sendNotification = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await AddNotification(notification);
      setIsOpen5(false);
      console.log(res);
      setLoading(false);
      getAllNotifications();
      alert("Notification Sent Successfully");
      if (res.status === 200) {
        setIsOpen5(false);
        setNotification({ title: "", description: "" });
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const [editedLink, setEditedLink] = useState({
    id: "",
    name: "",
    link: "",
    image: "",
  });
  const [imageLoading, setImageLoading] = useState(false);

  const getAllSocialLinks = async () => {
    setLoading(true);
    try {
      const { data } = await FetchSocialLinks();
      console.log(data?.data);
      setSocialLinks(data?.data);
      // setCategories(data?.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const AddNewLink = async (e) => {
    e.preventDefault();
    if (!newLink.name || !newLink.link || !newLink.image) {
      window.alert("Please fill all the details.");
      return;
    }
    setView(false);
    setLoading(true);
    try {
      await AddSocialLink(newLink);
      setNewLink({
        name: "",
        link: "",
        image: "",
      });
      getAllSocialLinks();
    } catch (error) {
      console.log(error);
    }
  };

  const getAllNotifications = async () => {
    try {
      const { data } = await FetchNotifications();
      setNotificationData(data?.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const DeleteLink = async (id) => {
    const yes = window.confirm("Do you want to delete this social link?");
    if (yes) {
      setLoading(true);
      try {
        await DeleteSocialLink({ id: id });
        getAllSocialLinks();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const UpdateLink = async (e) => {
    e.preventDefault();
    setView(false);
    setLoading(true);
    if (!editedLink.name || !editedLink.link || !editedLink.image) {
      window.alert("Please fill all the details.");
      return;
    }
    try {
      await UpdateSocialLink(editedLink);
      setEditedLink({
        id: "",
        name: "",
        link: "",
        image: "",
      });
      getAllSocialLinks();
    } catch (error) {
      console.log(error);
    }
  };

  const handleLinkImage = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) {
      window.alert("Please attach the image");
      return;
    }
    setImageLoading(true);
    const fileRef = ref(storage, `social-link/${file.name + v4()}`);
    const next = await uploadBytes(fileRef, file);
    const url = await getDownloadURL(next.ref);
    if (state === "AddSocialLink") {
      setNewLink({
        ...newLink,
        image: url,
      });
    } else {
      setEditedLink({
        ...editedLink,
        image: url,
      });
    }
    setImageLoading(false);
  };

  console.log(editedLink);

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await GetControl();
      if (data.success && data.message === "Fetched Successfuly!")
        setControlData(data.data);
    };
    fetchData();
  }, [modalIsOpen, modalIsOpen1, modalIsOpen2, modalIsOpen3, modalIsOpen4]);

  useEffect(() => {
    getAllSocialLinks();
    getAllNotifications();
  }, []);

  const handleSave = async () => {
    if (controlData.SpinWin < 0 || controlData.SpinWin > 100) {
      alert(
        "Spin Win should be greater than 0 and should be less than or equal 100"
      );
      return;
    }
    setLoading(true);
    const data = await UpdateControls({ ...controlData, id: controlData._id });
    setLoading(false);
    if (data.success && data.message === "Updated Successfuly!") {
      alert("Updated Successfully");
    }
  };

  const handleChangeControl = (e) => {
    setControlData((old) => {
      return { ...old, [e.target.name]: e.target.value };
    });
  };

  const handleInputPay = (e) => {
    setInput((old) => {
      return { ...old, [e.target.name]: e.target.value };
    });
  };

  const handleInputCoupon = (e) => {
    setInputCoupon((old) => {
      return { ...old, [e.target.name]: e.target.value };
    });
  };

  const handleImageDeposit = (event) => {
    setFileDeposit(event.target.files[0]);
  };

  const handleImageWithdrawal = (event) => {
    setFileWithdrawal(event.target.files[0]);
  };

  const handleInputChat = (e) => {
    setInputChat({ option: e.target.value });
  };

  const handleAddDeposit = async (event) => {
    setLoading(true);
    event.preventDefault();
    if (!fileDeposit) {
      alert("attach the image");
      return;
    }
    const fileRef = ref(storage, `depositMethods/${fileDeposit.name + v4()}`);
    const next = await uploadBytes(fileRef, fileDeposit);
    const url = await getDownloadURL(next.ref);
    const data = await AddDeposit(input.deposit, url, input.mobileNumber);
    if (data.success && data.message === "Added Successfuly!") {
      setLoading(false);
      setInput((old) => {
        return { ...old, deposit: "" };
      });
      setFileDeposit();
      setLoading(false);
      closeModalDeposit();
    }
  };

  const handleAddWithdrawal = async (event) => {
    event.preventDefault();
    if (!fileWithdrawal) {
      alert("attach the image");
      return;
    }
    const fileRef = ref(
      storage,
      `withdrawalMethods/${fileWithdrawal.name + v4()}`
    );
    const next = await uploadBytes(fileRef, fileWithdrawal);
    const url = await getDownloadURL(next.ref);
    const data = await AddWithdrawal(input.withdawal, url, input.mobileNumber);
    if (data.success && data.message === "Added Successfuly!") {
      setInput((old) => {
        return { ...old, withdawal: "" };
      });
      setFileWithdrawal();
      closeModalWithdrawal();
    }
  };

  const handleAddCoupon = async (event) => {
    event.preventDefault();
    const data = await AddCoupon(inputCoupon);
    if (data.success && data.message === "Added Successfuly!") {
      setInputCoupon({
        name: "",
        amountCredit: "",
        cashback: "",
        Terms: "",
      });
      closeModalCoupon();
    }
  };

  const handleAddChat = async (event) => {
    event.preventDefault();
    const data = await AddChatOption(inputChat);
    if (data.success && data.message === "Added Successfuly!") {
      setInputCoupon({
        option: "",
      });
      closeModalChat();
    }
  };

  const handleDeleteDeposit = async (id) => {
    const yes = window.confirm("Do you want to delete this deposit method?");
    if (yes) {
      try {
        const data = await DeleteDeposit(id);
        if (data.success && data.message === "Deleted Successfuly!") {
          setControlData((old) => {
            const deposit = old.depositMethods.filter(
              (item) => item?._id !== id
            );
            return { ...old, depositMethods: deposit };
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleDeleteWithdrawal = async (id) => {
    const yes = window.confirm("Do you want to delete this deposit method?");
    if (yes) {
      setLoading(true);
      try {
        const data = await DeleteWithdrawal(id);
        setLoading(false);
        if (data.success && data.message === "Deleted Successfuly!") {
          setControlData((old) => {
            const deposit = old.withdawalMethods.filter(
              (item) => item?._id !== id
            );
            return { ...old, withdawalMethods: deposit };
          });
        }
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    }
  };

  const handleDeleteCoupon = async (id) => {
    const data = await DeleteCoupon(id);
    if (data.success && data.message === "Deleted Successfuly!") {
      setControlData((old) => {
        const deposit = old.coupons.filter((item) => item?._id !== id);
        return { ...old, coupons: deposit };
      });
    }
  };
  const handleNotificationDelete = async (id) => {
    const yes = window.confirm(
      "Are you sure you want to delete this notification?"
    );
    if (yes) {
      try {
        const data = await DeleteNotification(id);
        if (data.success) {
          getAllNotifications();
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleDeleteChat = async (item) => {
    const data = await DeleteChat(item);
    if (data.success && data.message === "Deleted Successfuly!") {
      setControlData((old) => {
        const deposit = old.chatOptions.filter((item1) => item1 !== item);
        return { ...old, chatOptions: deposit };
      });
    }
  };

  function openModalImage() {
    setIsOpen(true);
  }

  function closeModalImage() {
    setIsOpen(false);
  }

  function openModalDeposit() {
    setIsOpen1(true);
  }

  function closeModalDeposit() {
    setIsOpen1(false);
  }

  function openModalWithdrawal() {
    setIsOpen2(true);
  }

  function closeModalWithdrawal() {
    setIsOpen2(false);
  }

  function openModalCoupon() {
    setIsOpen3(true);
  }

  function closeModalCoupon() {
    setIsOpen3(false);
  }

  function openModalChat() {
    setIsOpen4(true);
  }
  function openModalNotification() {
    setIsOpen5(true);
  }

  function closeModalChat() {
    setIsOpen4(false);
  }

  const handleModalwithdrawal = () => {
    openModalWithdrawal();
  };

  const handleModalDeposits = () => {
    openModalDeposit();
  };

  const handleModalCoupon = () => {
    openModalCoupon();
  };

  const handleImageModal = (img, mobile) => {
    setImg(img);
    setMobileNumber(mobile);
    openModalImage();
  };

  const handleModalChat = () => {
    openModalChat();
  };
  const handleNotificationModal = () => {
    openModalNotification();
  };

  return (
    <div className="container-fluid">
      <Modal
        isOpen={modalIsOpen1}
        onRequestClose={closeModalDeposit}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div>
          <div className="d-flex justify-content-end">
            <button
              onClick={closeModalDeposit}
              style={{ border: "none", backgroundColor: "white" }}
            >
              <span>
                <AiOutlineClose size={18} />
              </span>
            </button>
          </div>
          <form onSubmit={handleAddDeposit}>
            <div className="mb-3">
              <label htmlFor="Coins">Mode of Payment</label>
              <input
                type="text"
                className="form-control mt-3"
                id="Coins"
                aria-describedby="Entry Fees"
                name="deposit"
                value={input?.deposit}
                onChange={handleInputPay}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="Amount">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageDeposit}
                className="mt-3"
              />
            </div>
            <div>
              <label htmlFor="Coins">Mobile Number</label>
            </div>
            <input
              type="text"
              className="form-control mt-3"
              name="mobileNumber"
              onChange={handleInputPay}
              // value={controlData.depositNumber}
            />
            <div className="d-flex justify-content-center mt-2">
              <button type="submit" className="button-style" disabled={loading}>
                {loading ? "Adding..." : "Add"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
      <Modal
        isOpen={modalIsOpen2}
        onRequestClose={closeModalWithdrawal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div>
          <div className="d-flex justify-content-end">
            <button
              onClick={closeModalWithdrawal}
              style={{ border: "none", backgroundColor: "white" }}
            >
              <span>
                <AiOutlineClose size={18} />
              </span>
            </button>
          </div>
          <form onSubmit={handleAddWithdrawal}>
            <div className="mb-3">
              <label htmlFor="Coins">Mode of Payment</label>
              <input
                type="text"
                className="form-control mt-3"
                id="Coins"
                aria-describedby="Entry Fees"
                name="withdawal"
                value={input?.withdawal}
                onChange={handleInputPay}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="Amount">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageWithdrawal}
                className="mt-3"
              />
            </div>

            <div className="d-flex justify-content-center">
              <button type="submit" className="button-style">
                {loading ? "Adding..." : "Add"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
      <Modal
        isOpen={modalIsOpen3}
        onRequestClose={closeModalCoupon}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div>
          <div className="d-flex justify-content-end">
            <button
              onClick={closeModalCoupon}
              style={{ border: "none", backgroundColor: "white" }}
            >
              <span>
                <AiOutlineClose size={18} />
              </span>
            </button>
          </div>
          <form onSubmit={handleAddCoupon}>
            <div className="mb-3">
              <label htmlFor="Coins">Name</label>
              <input
                type="text"
                className="form-control mt-3"
                id="Coins"
                aria-describedby="Entry Fees"
                name="name"
                value={inputCoupon?.name}
                onChange={handleInputCoupon}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="Coins">Amount Credits</label>
              <input
                type="number"
                className="form-control mt-3"
                id="Coins"
                aria-describedby="Entry Fees"
                name="amountCredit"
                value={inputCoupon?.amountCredit}
                onChange={handleInputCoupon}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="Coins">Cashback</label>
              <input
                type="number"
                className="form-control mt-3"
                id="Coins"
                aria-describedby="Entry Fees"
                name="cashback"
                value={inputCoupon?.cashback}
                onChange={handleInputCoupon}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="Coins">Terms</label>
              <input
                type="text"
                className="form-control mt-3"
                id="Coins"
                aria-describedby="Entry Fees"
                name="Terms"
                value={inputCoupon?.Terms}
                onChange={handleInputCoupon}
                required
              />
            </div>
            <div className="d-flex justify-content-center">
              <button type="submit" className="button-style">
                Add
              </button>
            </div>
          </form>
        </div>
      </Modal>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModalImage}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div>
          <div className="d-flex justify-content-end">
            <button
              onClick={closeModalImage}
              style={{ border: "none", backgroundColor: "white" }}
            >
              <span>
                <AiOutlineClose size={18} />
              </span>
            </button>
          </div>
          <div className="container-fluid p-3">
            <img src={img} alt="no img" />
          </div>
          {mobileNumber && (
            <div className="container-fluid p-3">
              <label className="my-2">Mobile Number</label>
              <input className="form-control" value={mobileNumber} readOnly />
            </div>
          )}
        </div>
      </Modal>
      <Modal
        isOpen={modalIsOpen4}
        onRequestClose={closeModalChat}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div>
          <div className="d-flex justify-content-end">
            <button
              onClick={closeModalChat}
              style={{ border: "none", backgroundColor: "white" }}
            >
              <span>
                <AiOutlineClose size={18} />
              </span>
            </button>
          </div>
          <form onSubmit={handleAddChat}>
            <div className="mb-3">
              <label htmlFor="Coins">Chat option</label>
              <input
                type="text"
                className="form-control mt-3"
                id="Coins"
                aria-describedby="Entry Fees"
                name="option"
                value={inputChat?.option}
                onChange={handleInputChat}
                required
              />
            </div>
            <div className="d-flex justify-content-center">
              <button type="submit" className="button-style">
                Add
              </button>
            </div>
          </form>
        </div>
      </Modal>
      <Modal
        isOpen={view}
        onRequestClose={() => setView(false)}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div>
          <div className="d-flex justify-content-end">
            <button
              onClick={() => setView(false)}
              style={{ border: "none", backgroundColor: "white" }}
            >
              <span>
                <AiOutlineClose size={18} />
              </span>
            </button>
          </div>
          {state === "AddSocialLink" && (
            <form onSubmit={(e) => AddNewLink(e)}>
              <div className="mb-3">
                <label htmlFor="socialMediaName">Social Media Name</label>
                <input
                  type="text"
                  className="form-control mt-3"
                  id="socialMediaName"
                  aria-describedby="Entry Fees"
                  name="socialMediaName"
                  placeholder="Name"
                  value={newLink.name}
                  onChange={(e) =>
                    setNewLink({ ...newLink, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="socialMediaLink">Social Media Link</label>
                <input
                  type="url"
                  className="form-control mt-3"
                  id="socialMediaLink"
                  aria-describedby="Entry Fees"
                  name="socialMediaLink"
                  placeholder="Link"
                  value={newLink.link}
                  onChange={(e) =>
                    setNewLink({ ...newLink, link: e.target.value })
                  }
                  required
                />
              </div>
              {imageLoading ? (
                <div className="w-100 my-5 d-flex justify-content-center align-items-center">
                  <Spinner animation="border" variant="warning" />
                </div>
              ) : (
                <div className="img-container mb-3">
                  <img src={newLink.image ? newLink.image : NoImage} alt="" />
                  <p
                    style={{
                      fontSize: "11px",
                      textAlign: "left",
                      color: "red",
                      marginTop: "4px",
                    }}
                  >
                    *Uploaded image should be 45px X 45px
                  </p>
                </div>
              )}
              <div className="mb-3">
                <label htmlFor="Amount">Upload Social Media Icon</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleLinkImage(e)}
                  className="form-control mt-3"
                />
              </div>
              <div className="d-flex justify-content-center">
                {imageLoading ? (
                  <div className="w-100 my-5 d-flex justify-content-center align-items-center">
                    <Spinner animation="border" variant="warning" />
                  </div>
                ) : (
                  <button type="submit" className="button-style">
                    Add
                  </button>
                )}
              </div>
            </form>
          )}
          {state === "EditSocialLink" && (
            <form onSubmit={(e) => UpdateLink(e)}>
              <div className="mb-3">
                <label htmlFor="socialMediaName">Social Media Name</label>
                <input
                  type="text"
                  className="form-control mt-3"
                  id="socialMediaName"
                  aria-describedby="Entry Fees"
                  name="socialMediaName"
                  placeholder="Name"
                  value={editedLink.name}
                  onChange={(e) =>
                    setEditedLink({ ...editedLink, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="socialMediaLink">Social Media Link</label>
                <input
                  type="url"
                  className="form-control mt-3"
                  id="socialMediaLink"
                  aria-describedby="Entry Fees"
                  name="socialMediaLink"
                  placeholder="Link"
                  value={editedLink.link}
                  onChange={(e) =>
                    setEditedLink({ ...editedLink, link: e.target.value })
                  }
                  required
                />
              </div>
              {imageLoading ? (
                <div className="w-100 my-5 d-flex justify-content-center align-items-center">
                  <Spinner animation="border" variant="warning" />
                </div>
              ) : (
                <div className="img-container mb-3">
                  <img
                    src={editedLink.image ? editedLink.image : NoImage}
                    alt=""
                  />
                  <p
                    style={{
                      fontSize: "11px",
                      textAlign: "left",
                      color: "red",
                      marginTop: "4px",
                    }}
                  >
                    *Uploaded image should be 45px X 45px
                  </p>
                </div>
              )}
              <div className="mb-3">
                <label htmlFor="Amount">Upload Social Media Icon</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleLinkImage(e)}
                  className="form-control mt-3"
                />
              </div>
              <div className="d-flex justify-content-center">
                {imageLoading ? (
                  <div className="w-100 my-5 d-flex justify-content-center align-items-center">
                    <Spinner animation="border" variant="warning" />
                  </div>
                ) : (
                  <button type="submit" className="button-style">
                    Update
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </Modal>
      <Modal
        isOpen={modalIsOpen5}
        onRequestClose={() => setIsOpen5(false)}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div>
          <div className="d-flex justify-content-end">
            <button
              onClick={() => setIsOpen5(false)}
              style={{ border: "none", backgroundColor: "white" }}
            >
              <span>
                <AiOutlineClose size={18} />
              </span>
            </button>
          </div>
          <form onSubmit={(e) => sendNotification(e)}>
            <div className="mb-3">
              <label htmlFor="socialMediaName">Notification Message</label>
              <input
                type="text"
                className="form-control mt-3"
                id="socialMediaName"
                aria-describedby="Entry Fees"
                name="title"
                placeholder="notification message"
                onChange={(e) =>
                  setNotification({ ...notification, title: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="socialMediaName">Notification Description</label>
              <textarea
                type="text"
                className="form-control mt-3"
                id="socialMediaName"
                aria-describedby="Entry Fees"
                name="description"
                placeholder="notification description"
                onChange={(e) =>
                  setNotification({
                    ...notification,
                    description: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="d-flex justify-content-center">
              <button type="submit w-100" className="button-style">
                {loading ? "Sending..." : "Send"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
      <div className="mt-5 pt-5"></div>
      <div
        className="row"
        style={{
          color: "#FF9933",
          fontSize: "24px",
          fontWeight: "500",
          width: "100%",
          marginBottom: "20px",
        }}
      >
        Controls
      </div>
      <div className="row">
        <div style={{ fontSize: "22px", fontWeight: "550" }}>
          Account Details
        </div>
        <div className="d-flex justify-content-start my-3">
          <div
            className="d-flex flex-column p-3"
            style={{
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.25)",
              borderRadius: "20px",
              width: "480px",
            }}
          >
            <div className="d-flex">
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "650",
                  marginBottom: "10px",
                }}
              >
                Deposits
              </div>
            </div>
            <div className="d-flex ps-2 justify-content-between">
              <div className=""></div>
              <div className="ms-3" style={{ width: "260px" }}>
                <div
                  className="d-flex"
                  style={{
                    fontSize: "18px",
                    color: "#6A6A6A",
                    fontWeight: "500",
                  }}
                >
                  <div>Payment Method</div>
                  <div
                    className="ms-3 d-flex justify-content-center align-items-center addsymbol"
                    onClick={handleModalDeposits}
                  >
                    +
                  </div>
                </div>
                <div className="d-flex pt-2 justify-content-between flex-wrap">
                  {controlData?.depositMethods.map((item, id) => (
                    <div
                      className="d-flex align-items-center px-3 py-2"
                      key={item?._id}
                    >
                      <div>{id + 1}.</div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: "16px",
                          fontWeight: "600",
                          marginLeft: "7px",
                          cursor: "pointer",
                        }}
                      >
                        <h6
                          className="pt-1"
                          onClick={() =>
                            handleImageModal(item?.image, item?.mobileNumber)
                          }
                        >
                          {item?.name}
                        </h6>
                        <AiOutlineDelete
                          className="ms-2 mx-2"
                          onClick={() => handleDeleteDeposit(item?._id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-end">
              <button
                style={{
                  marginTop: "30px",
                  marginBottom: "10px",
                  border: "none",
                  background: "#FF9933",
                  color: "white",
                  borderRadius: "8px",
                  height: "40px",
                  width: "200px",
                }}
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
          <div
            className="d-flex flex-column p-3 ms-5"
            style={{
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.25)",
              borderRadius: "20px",
              width: "480px",
            }}
          >
            <div className="d-flex">
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "650",
                  marginBottom: "10px",
                }}
              >
                Withdrawls
              </div>
            </div>
            <div className="d-flex ps-2 justify-content-between">
              <div className="">
                {/* <div
                  style={{
                    fontSize: "18px",
                    color: "#6A6A6A",
                    fontWeight: "500",
                  }}
                >
                  Phone Number
                </div>
                <input
                  type="text"
                  style={{
                    border: "none",
                    borderBottom: "2px solid #AEB1D4",
                    width: "140px",
                  }}
                  name="withdawalNumber"
                  onChange={handleChangeControl}
                  value={controlData.withdawalNumber}
                /> */}
              </div>
              <div className="ms-3 " style={{ width: "260px" }}>
                <div
                  className="d-flex"
                  style={{
                    fontSize: "18px",
                    color: "#6A6A6A",
                    fontWeight: "500",
                  }}
                >
                  <div>Payment Method</div>
                  <div
                    className="ms-3 d-flex justify-content-center align-items-center addsymbol"
                    onClick={handleModalwithdrawal}
                  >
                    +
                  </div>
                </div>
                <div className="d-flex pt-2 justify-content-between flex-wrap">
                  {controlData?.withdawalMethods.map((item, id) => (
                    <div
                      className="d-flex align-items-center px-3 py-2"
                      key={item?._id}
                    >
                      <div>{id + 1}.</div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: "16px",
                          fontWeight: "600",
                          marginLeft: "7px",
                          cursor: "pointer",
                        }}
                      >
                        <h6
                          className="pt-1"
                          onClick={() =>
                            handleImageModal(item?.image, item?.mobileNumber)
                          }
                        >
                          {item?.name}
                        </h6>
                        <AiOutlineDelete
                          className="ms-2 mx-2"
                          onClick={() => handleDeleteWithdrawal(item?._id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-end">
              <button
                style={{
                  marginTop: "30px",
                  marginBottom: "10px",
                  border: "none",
                  background: "#FF9933",
                  color: "white",
                  borderRadius: "8px",
                  height: "40px",
                  width: "200px",
                }}
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div style={{ fontSize: "22px", fontWeight: "550" }}>Transactions</div>
        <div className="d-flex justify-content-start my-4">
          <div
            className="d-flex flex-column  me-5 p-4"
            style={{
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.25)",
              borderRadius: "15px",
              width: "210px",
            }}
          >
            <div style={{ fontSize: "23px", fontWeight: "600" }}>Deposits</div>

            <div>
              <div
                style={{
                  fontSize: "16px",
                  marginTop: "20px",
                  fontWeight: "500",
                  color: "#6A6A6A",
                }}
              >
                Min amount
              </div>
              <input
                type="number"
                style={{
                  marginRight: "10px",
                  border: "none",
                  borderBottom: "2px solid #AEB1D4",
                  width: "40px",
                }}
                name="minDeposit"
                onChange={handleChangeControl}
                value={controlData.minDeposit}
              />
            </div>
            <div>
              <div
                style={{
                  fontSize: "16px",
                  marginTop: "20px",
                  fontWeight: "500",
                  color: "#6A6A6A",
                }}
              >
                Max amount
              </div>
              <input
                type="number"
                style={{
                  marginRight: "10px",
                  border: "none",
                  borderBottom: "2px solid #AEB1D4",
                  width: "40px",
                }}
                name="maxDeposit"
                onChange={handleChangeControl}
                value={controlData.maxDeposit}
              />
            </div>
          </div>
          <div
            className="d-flex flex-column  me-5 p-4"
            style={{
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.25)",
              borderRadius: "15px",
              width: "210px",
            }}
          >
            <div style={{ fontSize: "23px", fontWeight: "600" }}>
              Withdrawls
            </div>
            <div>
              <div
                style={{
                  fontSize: "16px",
                  marginTop: "20px",
                  fontWeight: "500",
                  color: "#6A6A6A",
                }}
              >
                Min amount
              </div>
              <input
                type="number"
                style={{
                  marginRight: "10px",
                  border: "none",
                  borderBottom: "2px solid #AEB1D4",
                  width: "40px",
                }}
                name="minWithdawal"
                onChange={handleChangeControl}
                value={controlData.minWithdawal}
              />
            </div>
            <div>
              <div
                style={{
                  fontSize: "16px",
                  marginTop: "20px",
                  fontWeight: "500",
                  color: "#6A6A6A",
                }}
              >
                Max amount
              </div>
              <input
                type="number"
                style={{
                  marginRight: "10px",
                  border: "none",
                  borderBottom: "2px solid #AEB1D4",
                  width: "40px",
                }}
                name="maxWithdawal"
                onChange={handleChangeControl}
                value={controlData.maxWithdawal}
              />
            </div>
          </div>
          <button
            style={{
              border: "none",
              background: "#FF9933",
              color: "white",
              borderRadius: "8px",
              height: "40px",
              width: "100px",
            }}
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
      <div className="row">
        <div style={{ fontSize: "22px", fontWeight: "550" }}>Add Cash</div>
        <div className="d-flex justify-content-start my-4 align-items-center">
          {controlData.coupons.map((item, id) => (
            <div
              className="d-flex flex-column align-items-start me-5 p-3"
              style={{
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.25)",
                borderRadius: "15px",
                width: "230px",
              }}
              key={item?._id}
            >
              <div style={{ fontSize: "23px", fontWeight: "600" }}>
                {item?.name}{" "}
                <AiOutlineDelete
                  className="ms-2"
                  onClick={() => handleDeleteCoupon(item?._id)}
                />
              </div>

              <div>
                <div
                  style={{
                    fontSize: "16px",
                    marginTop: "20px",
                    fontWeight: "500",
                    color: "#6A6A6A",
                  }}
                >
                  Amount Credit: {item?.amountCredit}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "16px",
                    marginTop: "20px",
                    fontWeight: "500",
                    color: "#6A6A6A",
                  }}
                >
                  Cashback: {item?.cashback}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "16px",
                    marginTop: "20px",
                    fontWeight: "500",
                    color: "#6A6A6A",
                  }}
                >
                  Terms and conditions
                </div>
                <div>{item?.Terms}</div>
              </div>
            </div>
          ))}
          <div
            className=" d-flex justify-content-center align-items-center"
            style={{
              borderRadius: "40px",
              background: " rgb(211, 206, 206)",
              height: "80px",
              width: "80px",
              fontSize: "50px",
              fontWeight: "900",
              paddingBottom: "10px",
              color: "rgb(104, 106, 106)",
              cursor: "pointer",
            }}
            onClick={handleModalCoupon}
          >
            +
          </div>
        </div>
      </div>
      <div className="row">
        <div style={{ fontSize: "22px", fontWeight: "550" }}>
          Add Win Probability
        </div>
        <div className="d-flex justify-content-start my-4 align-items-center">
          <div
            className="d-flex flex-column align-items-start me-5 p-3"
            style={{
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.25)",
              borderRadius: "15px",
              width: "480px",
            }}
          >
            <div>
              <div
                className="d-flex justify-content-between"
                style={{
                  fontSize: "19px",
                  marginTop: "10px",
                  marginBottom: "20px",
                  fontWeight: "500",
                  color: "#6A6A6A",
                }}
              >
                <div>Spin Win Percentage</div>
                <button
                  style={{
                    border: "none",
                    background: "#FF9933",
                    color: "white",
                    borderRadius: "8px",
                    height: "40px",
                    width: "100px",
                  }}
                  disabled={loading}
                  onClick={handleSave}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
              <input
                placeholder="Please enter 0-100"
                type="number"
                style={{
                  marginRight: "10px",
                  border: "none",
                  borderBottom: "2px solid #AEB1D4",
                  width: "400px",
                }}
                name="SpinWin"
                onChange={handleChangeControl}
                value={controlData.SpinWin}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div style={{ fontSize: "22px", fontWeight: "550" }}>Chat With Us</div>
        <div className="d-flex justify-content-start my-4 align-items-center">
          <div
            className="d-flex flex-column align-items-start me-5 p-3"
            style={{
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.25)",
              borderRadius: "15px",
              width: "480px",
            }}
          >
            <div>
              <div
                className="d-flex justify-content-between"
                style={{
                  fontSize: "19px",
                  marginTop: "10px",
                  marginBottom: "20px",
                  fontWeight: "500",
                  color: "#6A6A6A",
                }}
              >
                <div>Link</div>
                <button
                  style={{
                    border: "none",
                    background: "#FF9933",
                    color: "white",
                    borderRadius: "8px",
                    height: "40px",
                    width: "100px",
                  }}
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
              <input
                type="text"
                style={{
                  marginRight: "10px",
                  border: "none",
                  borderBottom: "2px solid #AEB1D4",
                  width: "400px",
                }}
                name="chatLink"
                onChange={handleChangeControl}
                value={controlData.chatLink}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            maxWidth: "480px",
          }}
        >
          <div style={{ fontSize: "22px", fontWeight: "550" }}>
            Add Social Links
          </div>
          <button
            style={{
              border: "none",
              background: "#FF9933",
              color: "white",
              borderRadius: "8px",
              height: "40px",
              width: "125px",
            }}
            onClick={() => {
              setState("AddSocialLink");
              setView(true);
            }}
          >
            Add Link
          </button>
        </div>
        <div className="d-flex justify-content-start my-4 align-items-center">
          {loading ? (
            <div className="w-100 my-5 d-flex justify-content-center align-items-center">
              <Spinner animation="border" variant="warning" />
            </div>
          ) : socialLinks.length !== 0 ? (
            <div className="category-cards">
              {socialLinks.map((social, index) => (
                <div className="category-card" key={index}>
                  <div className="top mb-3">
                    <h6
                      style={{
                        cursor: "pointer",
                        textTransform: "capitalize",
                      }}
                    >
                      {social?.name}
                    </h6>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <AiFillEdit
                        size={16}
                        color="#ff9933"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setState("EditSocialLink");
                          setView(true);
                          setEditedLink({
                            id: social?._id,
                            name: social?.name,
                            link: social?.link,
                            image: social?.image,
                          });
                        }}
                      />
                      <div
                        style={{
                          width: "25px",
                          height: "25px",
                          display: "grid",
                          placeContent: "center",
                          backgroundColor: "lightgrey",
                          borderRadius: "50%",
                          cursor: "pointer",
                        }}
                        onClick={() => DeleteLink(social._id)}
                      >
                        <MdDelete size={16} color="rgba(18, 18, 18, 0.5)" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <img
                      src={social?.image}
                      alt=""
                      style={{
                        cursor: "pointer",
                        height: "45px",
                        maxWidth: "45px",
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                    />
                  </div>
                  <a
                    href={social?.link}
                    style={{
                      textDecoration: "none",
                      fontSize: "12px",
                      fontWeight: "500",
                      marginTop: "8px",
                    }}
                  >
                    {social?.link}
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <h5 className="text-center mb-5">No Social Links To Display</h5>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          <div style={{ fontSize: "22px", fontWeight: "550" }}>Add Chats</div>
          <div className="d-flex justify-content-start my-4 align-items-center">
            <div
              className="d-flex flex-column align-items-start me-5 p-3"
              style={{
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.25)",
                borderRadius: "15px",
                width: "300px",
              }}
            >
              <div className="" style={{ width: "260px" }}>
                <div
                  className="d-flex"
                  style={{
                    fontSize: "18px",
                    color: "#6A6A6A",
                    fontWeight: "500",
                  }}
                >
                  <div>Chats</div>
                  <div
                    className="ms-3 d-flex justify-content-center align-items-center addsymbol"
                    onClick={handleModalChat}
                  >
                    +
                  </div>
                </div>
                <div className="d-flex pt-2 justify-content-between flex-wrap">
                  {controlData?.chatOptions.map((item, id) => (
                    <div
                      className="d-flex align-items-center px-3 py-2"
                      key={id}
                    >
                      <div>{id + 1}.</div>
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          marginLeft: "7px",
                        }}
                      >
                        {item}{" "}
                        <AiOutlineDelete
                          className="ms-2"
                          onClick={() => handleDeleteChat(item)}
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6">
          <div style={{ fontSize: "22px", fontWeight: "550" }}>
            Add Notification
          </div>
          <div className="d-flex justify-content-start my-4 align-items-center">
            <div
              className="d-flex flex-column align-items-start me-5 p-3"
              style={{
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.25)",
                borderRadius: "15px",
                width: "300px",
              }}
            >
              <div className="" style={{ width: "260px" }}>
                <div
                  className="d-flex"
                  style={{
                    fontSize: "18px",
                    color: "#6A6A6A",
                    fontWeight: "500",
                  }}
                >
                  <div>Notifications</div>
                  <div
                    className="ms-3 d-flex justify-content-center align-items-center addsymbol"
                    onClick={handleNotificationModal}
                  >
                    +
                  </div>
                </div>
                <div className="d-flex pt-2 justify-content-between flex-wrap">
                  {notificationData?.map((item, id) => (
                    <div
                      className="d-flex align-items-center px-3 py-2"
                      key={id}
                    >
                      <div>{id + 1}.</div>
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          marginLeft: "7px",
                        }}
                      >
                        {item?.title}
                        <AiOutlineDelete
                          className="ms-2 mx-2"
                          onClick={() => handleNotificationDelete(item?._id)}
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Control;
