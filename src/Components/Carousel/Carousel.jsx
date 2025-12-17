import { useEffect, useState } from "react";
import axios from "axios";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
import "@splidejs/react-splide/css"; // basic styles
import "./Carousel.scss";

let url = process.env.REACT_APP_API_URL;

function Carousel() {
  const [portDataImg, setPortDataImg] = useState([]);

  useEffect(() => {
    axios.get(`${url}partnericons`).then((res) => {
      setPortDataImg(res.data);
    });
  }, []);

  return (
    <section id="brands">
      <Splide
        options={{
          type: "loop",
          perPage: 5,
          gap: "1rem",
          autoScroll: {
            speed: 0.4,
            pauseOnHover: true,
            pauseOnFocus: false,
          },
          drag: "free",
          pagination: false,
          arrows: false,
          pauseOnHover: true,
          breakpoints: {
            1024: { perPage: 4 },
            768: { perPage: 3 },
            430: { perPage: 2 },
          },
        }}
        extensions={{ AutoScroll }}
      >
        {portDataImg.map((value) => (
          <SplideSlide key={value.name}>
            <div className="orb">
              <a href={value.url}>
                <img
                  src={process.env.REACT_APP_STORAGE_URL + value.icon}
                  alt={value.name}
                  style={{ objectFit: "contain" }}
                />
              </a>
            </div>
          </SplideSlide>
        ))}
      </Splide>
    </section>
  );
}

export default Carousel;
