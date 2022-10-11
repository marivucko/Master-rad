import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCompaniesInWhichUserIsRegistered } from "../../serverCommunicatoin/userCompanyCommunication";
import SendEmailForm from "../../components/forms/sendEmailForm/sendEmailForm";
import { GlobalContext } from "../../context/globalContext.js";

const ClientHomePage = () => {
  const { t } = useTranslation();
  let navigate = useNavigate();
  const { setIsLoading, user, companies, setCompanies, setSelectedCompanyId, setSelectedCompany } =
    useContext(GlobalContext);

  useEffect(() => {
    async function getCompanies() {
      const result = await getCompaniesInWhichUserIsRegistered(user?.email, setIsLoading, t);
      if (result.status === 200) {
        const fetchedCompanies = result.companies;
        setCompanies(fetchedCompanies);
      } else {
        setCompanies([]);
      }
    }
    getCompanies();
  }, [user]);

  return (
    <div className="behind-form">
      {companies?.length >= 1 ? (
        <div className="form form-companies">
          <h1 className="form-page-name">{t("client.home_page.title")}</h1>
          {companies?.map((company) => {
            return (
              <div
                className="form-company-name"
                key={company["_id"]}
                onClick={() => {
                  setSelectedCompanyId(company["_id"]);
                  setSelectedCompany(company);
                  navigate("/clientCompanyDetails");
                }}
              >
                {company.company_name}
              </div>
            );
          })}
        </div>
      ) : (
        <SendEmailForm />
      )}
    </div>
  );
};

export default ClientHomePage;
