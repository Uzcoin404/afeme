// Import => React
import React, { useState, useMemo } from "react";
import { NavLink as Link } from "react-router-dom";

// Import => Mui
import {
  Box,
  Card,
  CardMedia,
  Typography,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";

// Import => Components
import LoveBtn from "../LoveBtn/LoveBtn";
import LocationIcon from "../../Lib/Svg/location";
import DeleteIcon from "../../Lib/Svg/delete";
import EditIcon from "../../Lib/Svg/edit";

import CardTools from "../../Utils/cardTools";
import Notification from "../Notification/Notification";
import "./Card.scss";

// Import => Assets
import CardImg1 from "../../Assets/Img/hero-img.png";
import CardImg2 from "../../Assets/Img/advertImg.jpg";
import timesIcon from "../../Assets/Img/Icon/times.svg";

function Cards({ data, fullCard = false, isUserPost = false }) {
  // State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // Loading state for delete
  const [isSoldLoading, setIsSoldLoading] = useState(false); // Loading state for sold btn
  const [soldStatus, setSoldStatus] = useState(data.solt); // Local state for sold status
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  // Memoize Random Image to prevent changes on re-renders
  const fallbackImg = useMemo(() => {
    return Math.floor(Math.random() * 2) === 0 ? CardImg1 : CardImg2;
  }, []);

  // API Config
  const url = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("Token");

  // Extract Card Data
  const {
    price,
    advertTitle,
    advertLink,
    advertType,
    advertTypeLink,
    advertTypeImg,
    advertAddress,
  } = CardTools(data);

  // --- Handlers ---

  const handleDelete = async () => {
    setIsDeleting(true);
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    try {
      const response = await fetch(`${url}post/${data.id}`, {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow",
      });

      const result = await response.text();
      if (result) {
        const res = JSON.parse(result);
        if (res.status) {
          setShowDeleteModal(false);
          setShowSuccessMsg(true);
          // Instead of removing DOM node manually, we wait a moment then unmount
          setTimeout(() => setIsDeleted(true), 1500);
        }
      }
    } catch (error) {
      console.error("Delete failed", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMarkSold = async () => {
    setIsSoldLoading(true);
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    try {
      const response = await fetch(`${url}sold/${data.id}`, {
        method: "GET",
        headers: myHeaders,
      });
      const res = await response.text();
      // Assuming API returns 1 on success
      if (JSON.parse(res) == 1) {
        // Toggle local state to reflect change immediately
        setSoldStatus(soldStatus ? "" : "true");
      }
    } catch (error) {
      console.error("Mark sold failed", error);
    } finally {
      setIsSoldLoading(false);
    }
  };

  // --- Sub-Components / Render Helpers ---

  const renderDeleteModal = () => (
    <div className={`modal deleteModal ${showDeleteModal ? "modal--open" : ""}`}>
      <div className="deleteModal__content">
        <img src={timesIcon} alt="close" />
        <h3 className="deleteModal__title">Ishonchingiz komilmi?</h3>
        <p className="deleteModal__text">
          Ushbu e'lon va uning barcha ma'lumotlari butunlay o'chiriladi. Bu
          jarayonni ortga qaytarib bo'lmaydi.
        </p>
        <div className="deleteModal__btns">
          <Button
            className="deleteModal__button deleteModal__cancel"
            onClick={() => setShowDeleteModal(false)}
            sx={{ mr: 2 }}
            disabled={isDeleting}
          >
            Bekor qilish
          </Button>
          <Button
            className="deleteModal__button deleteModal__submit"
            color="error"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "O'chirilmoqda..." : "O'chirish"}
          </Button>
        </div>
        <IconButton
          aria-label="close"
          className="modal__close-btn"
          onClick={() => setShowDeleteModal(false)}
        />
      </div>
    </div>
  );

  const renderUserControls = () => (
    <>
      <Link to={`/userpostedit/${data.id}`} className="edit-btn">
        <IconButton
          variant="solid"
          color="primary"
          className="cardControls cardEdit"
          sx={{ mr: 1.5 }}
        >
          <EditIcon />
        </IconButton>
      </Link>
      <IconButton
        variant="outlined"
        color="error"
        className="cardControls cardDelete"
        onClick={() => setShowDeleteModal(true)}
      >
        <DeleteIcon />
      </IconButton>
    </>
  );

  const renderUserStatusItems = () => {
    if (!isUserPost) return null;

    return (
      <>
        <div className="card__sold">
          <Tooltip
            arrow
            title={
              !soldStatus
                ? "Sotilgan deb belgilangan e'lon faqat sizga ko'rinadi"
                : "E'lon barcha uchun ochiq bo'ladi"
            }
            color="primary"
            open={tooltipOpen}
            onMouseEnter={() => setTooltipOpen(true)}
            onMouseLeave={() => setTooltipOpen(false)}
            sx={{ backgroundColor: "#fff" }}
          >
            <Button
              color="primary"
              variant="contained"
              size="small"
              className="markAsSold"
              disabled={isSoldLoading}
              onClick={handleMarkSold}
            >
              {isSoldLoading
                ? "..."
                : !soldStatus
                ? "Sotilgan deb belgilash"
                : "Bekor qilish"}
            </Button>
          </Tooltip>
        </div>
        {data.check === "true" ? null : (data.check === "null" ||
            !data.check) &&
          isUserPost ? (
          <Tooltip
            title="E'lon operatorlar tomonidan ko'rib chiqilmoqda. Bu jarayonda e'lon faqat siz uchun ko'rinadi"
            placement="top"
          >
            <div className="card__verification">Ko'rib chiqilmoqda</div>
          </Tooltip>
        ) : (
          <Tooltip
            title="Iltimos e'lon ma'lumotlarini o'zgartirib ko'ring"
            placement="top"
          >
            <div className="card__verification">Rad etilgan</div>
          </Tooltip>
        )}
      </>
    );
  };

  // --- Main Render Logic ---

  // If deleted or invalid data logic, return null
  if (isDeleted) return null;

  // Basic validation check (same as original logic)
  const isValid =
    (data.check === "true" && data.solt !== "true") || isUserPost;

  if (!isValid) return null;

  // 1. GRID VIEW (Standard Card)
  if (!fullCard) {
    return (
      <>
        {showSuccessMsg && (
          <Notification
            message={"E'lon muvafaqqiyatli o'chirildi"}
            type={"success"}
          />
        )}
        {renderDeleteModal()}

        <Card sx={{ maxWidth: 300 }} className="card" cardid={data.id}>
          <div className="card__media">
            <Link to={advertLink}>
              <CardMedia
                component="img"
                alt={advertTitle}
                className="card__img"
                image={data.image?.length > 0 ? process.env.REACT_APP_URL + data.image[0]?.url : fallbackImg}
                onError={(e) => {
                  e.target.onerror = null; // prevent loop
                  e.target.src = fallbackImg;
                }}
              />
            </Link>
            {renderUserStatusItems()}
          </div>

          <Box className="card__content">
            <CardContent className="card__header">
              <Link to={advertTypeLink} className="house__type">
                <img
                  src={advertTypeImg}
                  alt=""
                  className="house__type__icon"
                />
                <p className="house__type__name">{advertType}</p>
              </Link>
              <Typography variant="body2" className="house__prices">
                <span className="house__price">{price}</span>
              </Typography>
            </CardContent>

            <CardContent className="card__main">
              <Link to={advertLink} className="card__title">
                {advertTitle}
              </Link>
            </CardContent>

            <CardActions className="card__footer">
              <Typography className="house__address__bar">
                <LocationIcon className="card__location" />{" "}
                <span className="house__address">{advertAddress}</span>
              </Typography>
              <div className="card__actions">
                {isUserPost ? renderUserControls() : <LoveBtn advertID={data.id} />}
              </div>
            </CardActions>
          </Box>
        </Card>
      </>
    );
  }

  // 2. LIST VIEW (Full Card)
  return (
    <Card className="fullCard">
      <Link to={advertLink}>
        <CardMedia
          className="fullCard__img"
          component="img"
          alt="Card img"
          image={data?.image?.length > 0 ? data?.image[0]?.url : fallbackImg}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallbackImg;
          }}
        />
      </Link>
      <Box className="card__content">
        <CardContent className="card__header">
          <Link to={advertTypeLink} className="house__type">
            <img src={advertTypeImg} alt="" className="house__type__icon" />
            <p className="house__type__name">{advertType}</p>
          </Link>
          <Typography variant="body2" className="house__prices">
            <span className="house__price">{price}</span>
          </Typography>
        </CardContent>

        <CardContent className="card__main">
          <div className="card__header__items">
            <Link to={advertLink} className="card__title">
              {advertTitle}
            </Link>
          </div>

          <div className="card__wrap">
            <div className="card__room card__men">Xonalar: {data.room}</div>
            <div className="card__flet card__men">Qavat: {data.floor}</div>
            <div className="card__ara card__men">
              Maydoni: {data.total_area} m²
            </div>
          </div>

          <p className="card__desc">{data?.description}</p>
        </CardContent>
        <CardActions className="card__footer">
          <div className="fullCard__foot">
            <Typography className="house__address__bar">
              <LocationIcon className="card__location" />{" "}
              <span className="house__address">{advertAddress}</span>
            </Typography>
          </div>
          <LoveBtn advertID={data.id} />
        </CardActions>
      </Box>
    </Card>
  );
}

export default Cards;