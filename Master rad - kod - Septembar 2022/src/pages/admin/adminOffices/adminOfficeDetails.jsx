import React, { useState, useEffect, useContext } from "react";
import ManageOffice from "./manageOffice";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../../context/globalContext.js";
import { useTranslation } from "react-i18next";
import "./../../form.css";
import { deleteOffice } from "../../../serverCommunicatoin/officeCommunication";
import { toast } from "react-toastify";

const AdminOfficeDetails = () => {
  const { t } = useTranslation();
  let navigate = useNavigate();

  const { setIsLoading, selectedCompanyId, selectedOffice } = useContext(GlobalContext);

  return (
    <div className="behind-form">
      <div className="form" style={{ marginTop: "5vh", backgroundColor: "white" }}>
        <h1 className="form-page-name" style={{ marginBottom: "3rem" }}>
          {t("admin.office_details.form_title")} {selectedOffice.office_name}
        </h1>
        <ManageOffice
          officeName={selectedOffice.office_name}
          numOfColumns={selectedOffice.columns}
          numOfRows={selectedOffice.rows}
          selectedCompanyId={selectedCompanyId}
          matrix={selectedOffice?.matrix}
          showSaveOrUpdate={0}
        />
        <button
          className="form-button"
          style={{ margin: "1.5rem" }}
          onClick={() => {
            navigate("/adminUpdateOffice");
          }}
        >
          {t("admin.office_details.update")}
        </button>
        <button
          className="form-button"
          style={{ margin: "1.5rem" }}
          onClick={async () => {
            let response = await deleteOffice(selectedOffice["_id"], setIsLoading, t);
            if (response.status === 200) {
              toast.success(t("admin.office_details.delete_success"));
              setTimeout(() => {
                navigate("/adminOffices");
              }, 1000);
            } else {
              toast.error(t("admin.office_details.delete_error"));
            }
          }}
        >
          {t("admin.office_details.delete")}
        </button>
      </div>
    </div>
  );
};

export default AdminOfficeDetails;
