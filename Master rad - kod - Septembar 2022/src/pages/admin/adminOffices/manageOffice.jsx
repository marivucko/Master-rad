import React, { useState, useEffect, useContext } from "react";
import ButtonTableOrientation from "../../../components/admin/buttonTableOrientation/buttonTableOrientation";
import ButtonTableOrientation45Angle from "../../../components/admin/buttonTableOrientation45Angle/buttonTableOrientation45Angle";
import Office from "../../../components/admin/office/office";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { addOffice, updateOffice } from "../../../serverCommunicatoin/officeCommunication";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../../context/globalContext.js";

const ManageOffice = ({
  officeName,
  floor,
  numOfColumns,
  numOfRows,
  selectedOffice,
  selectedCompanyId,
  matrix,
  showSaveOrUpdate = 0, // 0 - just show, 1 - save, 2 - update
}) => {
  const { t } = useTranslation();
  let navigate = useNavigate();
  const { setIsLoading } = useContext(GlobalContext);

  const [tableOrientation, setTableOrientation] = useState(0);
  const [tableOrientation45Angle, setTableOrientation45Angle] = useState(0.5);
  const [selectedTableOrientation, setSelectedTableOrientation] = useState(0);
  const [placesForTable, setPlacesForTable] = useState([]);

  const getNewMatrix = (initialMatrix) => {
    let b = [];
    for (var i = 0; i < numOfRows; i++) {
      let a = [];
      let insertEmptyValue1 =
        initialMatrix === null ||
        initialMatrix.length === 0 ||
        (initialMatrix.length < numOfRows && i >= initialMatrix.length);
      for (var j = 0; j < numOfColumns; j++) {
        let insertEmptyValue =
          insertEmptyValue1 || (initialMatrix[0].length < numOfColumns && j >= initialMatrix[0].length);
        if (showSaveOrUpdate === 0) {
          a.push({
            label: insertEmptyValue ? "" : initialMatrix.at(i).at(j).label,
            orientation: insertEmptyValue ? -1 : initialMatrix.at(i).at(j).orientation,
            user: insertEmptyValue ? "" : initialMatrix.at(i).at(j).user,
          });
        } else {
          a.push({
            label: insertEmptyValue ? "" : initialMatrix.at(i).at(j).label,
            orientation: insertEmptyValue ? -1 : initialMatrix.at(i).at(j).orientation,
          });
        }
      }
      b.push(a);
    }

    return b;
  };

  useEffect(() => {
    setPlacesForTable((prevState) => {
      return getNewMatrix(matrix);
    });
  }, []);

  useEffect(() => {
    setPlacesForTable((prevState) => {
      return getNewMatrix(prevState);
    });
  }, [numOfColumns, numOfRows]);

  const onClickTableOrientation = (e) => {
    setSelectedTableOrientation(0);
  };

  const onClickTableOrientation45Angle = (e) => {
    setSelectedTableOrientation(1);
  };

  const rotateTable = (e) => {
    setTableOrientation((prevState) => (prevState + 1) % 4);
    setSelectedTableOrientation(0);
  };

  const rotateTable45Angle = (e) => {
    setTableOrientation45Angle((prevState) => prevState + 1 - 4 * (prevState === 3.5));
    setSelectedTableOrientation(1);
  };

  const insertTable = (i, j, index) => {
    changePlaceForTable(i, j, true, "", index === 0 ? tableOrientation : tableOrientation45Angle);
  };

  const changeLabel = (i, j, label) => changePlaceForTable(i, j, true, label, -2);

  const deleteTable = (i, j) => changePlaceForTable(i, j, true, "", -1);

  const changePlaceForTable = (i, j, changeLabel, label, orientation) => {
    setPlacesForTable((prevState) => {
      const newState = prevState?.map((row, ii) => {
        let new_col = [];
        row?.map((col, jj) => {
          if (i === ii && j === jj) {
            new_col.push({
              label: changeLabel ? label : col.label,
              orientation: orientation >= -1 ? orientation : col.orientation,
            });
          } else {
            new_col.push(col);
          }
        });
        return new_col;
      });
      return newState;
    });
  };

  const deleteAllTables = () => {
    setPlacesForTable((prevState) => {
      let b = [];
      for (var i = 0; i < numOfRows; i++) {
        let a = [];
        for (var j = 0; j < numOfColumns; j++) {
          a.push({ label: "", orientation: -1 });
        }
        b.push(a);
      }
      return b;
    });
  };

  const countSeats = () => {
    let count = 0;
    for (var i = 0; i < numOfRows; i++) {
      for (var j = 0; j < numOfColumns; j++) {
        if (placesForTable.at(i).at(j).orientation > -1) {
          count++;
        }
      }
    }
    return count;
  };

  const saveAll = async () => {
    if (officeName == "") {
      toast.info(t("admin.add_office.office_name_error"));
      return;
    }
    if (floor == "") {
      toast.info(t("admin.add_office.floor_error"));
      return;
    }
    let numberOfSeats = countSeats();
    await addOffice(
      {
        office_name: officeName,
        company_id: selectedCompanyId,
        floor: floor,
        columns: numOfColumns,
        rows: numOfRows,
        num_of_seats: numberOfSeats,
        matrix: placesForTable,
      },
      setIsLoading,
      t,
      t("admin.add_office.success")
    );
    setTimeout(() => {
      navigate("/adminOffices");
    }, 1000);
  };

  const update = async () => {
    if (officeName == "") {
      toast.info(t("admin.add_office.office_name_error"));
      return;
    }
    if (floor == "") {
      toast.info(t("admin.add_office.floor_error"));
      return;
    }
    let numberOfSeats = countSeats();
    await updateOffice(
      {
        _id: selectedOffice["_id"],
        office_name: officeName,
        company_id: selectedCompanyId,
        floor: floor,
        columns: numOfColumns,
        rows: numOfRows,
        num_of_seats: numberOfSeats,
        matrix: placesForTable,
      },
      setIsLoading,
      t,
      t("admin.update_office.success")
    );
    setTimeout(() => {
      navigate("/adminOffices");
    }, 1000);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {showSaveOrUpdate > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "2rem",
            }}
          >
            <ButtonTableOrientation
              tableOrientation={tableOrientation}
              onClick={onClickTableOrientation}
              rotateTable={rotateTable}
              selectedTableOrientation={selectedTableOrientation === 0}
            />
            <ButtonTableOrientation45Angle
              tableOrientation={tableOrientation45Angle}
              onClick={onClickTableOrientation45Angle}
              rotateTable={rotateTable45Angle}
              selectedTableOrientation={selectedTableOrientation === 1}
            />
          </div>
        )}
        {showSaveOrUpdate > 0 && (
          <button onClick={deleteAllTables} className="form-button-reverse-color">
            {t("admin.update_office.remove_tables")}
          </button>
        )}
        <div>
          <Office
            tableOrientation={tableOrientation}
            tableOrientation45Angle={tableOrientation45Angle}
            selectedTableOrientation={selectedTableOrientation}
            placesForTable={placesForTable}
            insertTable={insertTable}
            changeLabel={changeLabel}
            deleteTable={deleteTable}
            showSaveOrUpdate={showSaveOrUpdate}
          />
        </div>
        {showSaveOrUpdate == 1 && (
          <button className="form-button" onClick={saveAll}>
            {t("admin.add_company.save")}
          </button>
        )}
        {showSaveOrUpdate == 2 && (
          <button className="form-button" onClick={update}>
            {t("admin.update_office.update")}
          </button>
        )}
      </div>
    </DndProvider>
  );
};

export default ManageOffice;
