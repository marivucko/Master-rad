import "./chooseLanguage.css";
import ReactCountryFlag from "react-country-flag";
import { useState } from "react";
import "../../i18n";
import { useTranslation } from "react-i18next";
import { languages } from "../../i18n";
import BackDrop from "./../../components/backdrop/backdrop";

function CountryFlag({ countryCode, onClick }) {
  return (
    <div className="country-flag-background">
      <div className="country-flag">
        <ReactCountryFlag
          style={{
            fontSize: "2.2em",
            lineHeight: "2.2em",
            width: "2.2em",
          }}
          countryCode={countryCode}
          svg
          onClick={onClick}
        />
      </div>
    </div>
  );
}

const ChooseLanguage = ({ countryLocale, setCountryLocale }) => {
  const [chooseLanguage, setChooseLanguage] = useState(false);
  const clickChooseLanguage = () => {
    setChooseLanguage((prevState) => !prevState);
  };

  return (
    <div>
      <BackDrop sidebar={chooseLanguage} closeSideBar={clickChooseLanguage} />
      <div onClick={clickChooseLanguage}>
        <div className={chooseLanguage ? "choose-langugage-opened" : ""}>
          <CountryFlag countryCode={countryLocale.countryCode} />
        </div>
        {chooseLanguage && <DropDownMenu />}
      </div>
    </div>
  );

  function DropDownMenu({}) {
    const { i18n } = useTranslation();

    function DropDownItem({ countryCode, selectLanguage }) {
      return (
        <div className="meni-item" onClick={selectLanguage}>
          <CountryFlag countryCode={countryCode} />
        </div>
      );
    }

    const countries = languages
      .filter((lng) => lng.countryCode != countryLocale.countryCode)
      .map((d) => (
        <DropDownItem
          key={d.countryCode}
          countryCode={d.countryCode}
          selectLanguage={() => {
            i18n.changeLanguage(d.countryCode);
            setCountryLocale(d);
          }}
        />
      ));

    return <div className="dropdown">{countries}</div>;
  }
};

export default ChooseLanguage;
