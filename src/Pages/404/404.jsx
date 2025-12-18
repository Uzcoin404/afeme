// Import => React
import React, { useContext } from "react";

// Import => Components
import notfound from "../../Assets/Img/404.svg";

// Import => Style Component
import "./404.scss";

// Import useContext => Localization
import { Context } from "../../Context/LangContext";
import content from "../../Localization/Content";

function Page404() {
    const { lang } = useContext(Context);
    
    return (
        <div className="page404">
            <h1 className="page404__title">{content[lang].page_not_found_title}</h1>
            <img className="page404__img" src={notfound} alt="404 image" />
            <p className="page404__desc">
                {content[lang].page_not_found_desc} <a href="/">{content[lang].page_not_found_link}</a>{" "}
            </p>
        </div>
    );
}
export default Page404;