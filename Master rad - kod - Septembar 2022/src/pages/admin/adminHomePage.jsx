import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { getCompaniesFromAdmin } from "../../serverCommunicatoin/companyCommunication.js";
import { useNavigate } from "react-router-dom";
import "./../form.css";
import { toast } from "react-toastify";
import { GlobalContext } from "../../context/globalContext.js";

const AdminHomePage = () => {
  const { t } = useTranslation();
  const { setIsLoading, user, companies, setCompanies, setSelectedCompany, setSelectedCompanyId } =
    useContext(GlobalContext);
  let navigate = useNavigate();

  useEffect(() => {
    async function getCompanies() {
      const result = await getCompaniesFromAdmin(user?.email, setIsLoading, t);
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
      <div className="form form-companies">
        <h1 className="form-page-name">{t("admin.home_page.title")}</h1>
        <div>
          {companies?.map((company) => {
            return (
              <div
                className="form-company-name"
                key={company["_id"]}
                onClick={() => {
                  setSelectedCompanyId(company["_id"]);
                  setSelectedCompany(company);
                  navigate("/adminCompanyDetails");
                }}
              >
                {company.company_name}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
