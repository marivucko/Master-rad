import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { getReservationFromComapnyForDate } from "../serverCommunicatoin/reservationCommunication";
import { getOfficiesFromComapny } from "../serverCommunicatoin/officeCommunication";
import { getRegisteredUserNamesInCompany } from "../serverCommunicatoin/userCompanyCommunication";
import { getProjectsFromComapny } from "../serverCommunicatoin/projectCommunication";

export async function getUsersNames(selectedCompany, setUsersNames, setIsLoading, t) {
  const result = await getRegisteredUserNamesInCompany(selectedCompany["_id"], setIsLoading, t);
  if (result.status === 200) {
    const fetchedUsersNames = result.usersNames;
    setUsersNames(fetchedUsersNames);
  } else {
    setUsersNames([]);
  }
}

export async function getProjects(selectedCompany, setProjects, setIsLoading, t) {
  const result = await getProjectsFromComapny(selectedCompany["_id"], setProjects, setIsLoading, t);
  if (result.status === 200) {
    const fetchedProjects = result.projects;
    setProjects(fetchedProjects);
  } else {
    setProjects([]);
  }
}

export async function getOffices(selectedCompany, setOffices, setIsLoading, t) {
  const result = await getOfficiesFromComapny(selectedCompany["_id"], setIsLoading, t);
  if (result.status === 200) {
    const fetchedOffices = result.offices;
    setOffices(fetchedOffices);
  } else {
    setOffices([]);
  }
}

export async function setMatrixOfOffices(selectedCompany, setOfficesMatrix, setIsLoading, t) {
  let result = await getOfficiesFromComapny(selectedCompany?.["_id"], setIsLoading, t);
  if (result.status === 200) {
    let fetchedOffices = result.offices;
    if (fetchedOffices.length === 0) {
      setOfficesMatrix([]);
    } else {
      fetchedOffices.sort((a, b) => {
        return a.floor < b.floor ? -1 : 1;
      });
      let officesMatrixCurr = [];
      let floors = [fetchedOffices.at(0).floor];
      let officesRow = [fetchedOffices.at(0)];
      let floor = fetchedOffices.at(0).floor;
      fetchedOffices.forEach((e, index) => {
        if (index >= 1) {
          if (floors.includes(e.floor)) {
            officesRow.push(e);
          } else {
            officesMatrixCurr.push({ floor: floor, officesRows: officesRow });
            officesRow = [e];
            floor = e.floor;
            floors.push(e.floor);
          }
        }
      });
      officesMatrixCurr.push({ floor: floor, officesRows: officesRow });
      setOfficesMatrix(officesMatrixCurr);
    }
  } else {
    setOfficesMatrix([]);
  }
}

export async function getReservations(
  selectedCompany,
  dateObject,
  setSelectedOfficeReservation,
  setSelectedResOff,
  setIsLoading,
  offices,
  t
) {
  const result = await getReservationFromComapnyForDate(
    selectedCompany["_id"] + "/" + dateObject.year + "/" + dateObject.month + "/" + dateObject.day,
    setIsLoading,
    t
  );
  let fetchedReservation = null;
  if (result.status === 200) {
    fetchedReservation = result.reservation;
    setSelectedOfficeReservation(fetchedReservation);
    setSelectedResOff({
      office: offices?.find((e) => e["_id"] === fetchedReservation?.offices?.at(0)["office_id"]),
      users: fetchedReservation?.offices?.at(0)["users"],
    });
  } else {
    setSelectedOfficeReservation(null);
    setSelectedResOff(null);
  }
  return fetchedReservation;
}
