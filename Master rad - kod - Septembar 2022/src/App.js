import NavBar from "./components/navbar/navbar";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import "./App.css";
import Home from "./pages/home";
import SideBar from "./components/sidebar/sidebar";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import AdminHomePage from "./pages/admin/adminHomePage";
import AdminAddCompany from "./pages/admin/adminCompanies/adminAddCompany";
import ClientHomePage from "./pages/client/clientHomePage";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase-config.js";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AdminAddOffice from "./pages/admin/adminOffices/adminAddOffice";
import AdminCompanyDetails from "./pages/admin/adminCompanies/adminCompanyDetails";
import AdminOfficeDetails from "./pages/admin/adminOffices/adminOfficeDetails";
import AdminUpdateOffice from "./pages/admin/adminOffices/adminUpdateOffice";
import ClientCompanyDetails from "./pages/client/clientCompanyDetails";
import { LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { languages } from "./i18n";
import AdminWorkersMainPage from "./pages/admin/adminWorkers/adminWorkersMainPage";
import AdminWorkersInviteUser from "./pages/admin/adminWorkers/adminWorkersInviteUser";
import { getUser } from "./serverCommunicatoin/userCommunication";
import AdminOffices from "./pages/admin/adminOffices/adminOffices";
import { GlobalContext } from "./context/globalContext";
import AdminSeatingChart from "./pages/admin/adminSeatingChart";
import ClientSeatingChart from "./pages/client/clientSeatingChart";
import ClientReserveTable from "./pages/client/clientReserveTable";
import React from "react";
import { ToastContainer } from "react-toastify";
import AdminUpdateCompany from "./pages/admin/adminCompanies/adminUpdateCompany";
import AdminAnalysis from "./pages/admin/adminAnalysis";
import LoadingSpinner from "./components/loadingSpinner/loadingSpinner";
import AdminProjects from "./pages/admin/adminProjects";
import ClientCoworkers from "./pages/client/clientCoworkers";

function App() {
  const [countryLocale, setCountryLocale] = useState(languages[0]);

  const [sideBar, setSideBar] = useState(false);
  const toggleSidebar = () => {
    setSideBar((prevState) => !prevState);
  };

  const { t } = useTranslation();
  let navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [user, setUser] = useState();
  const [mongoUser, setMongoUser] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedCompany, setSelectedCompany] = useState();

  const [offices, setOffices] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState();

  const [projects, setProjects] = useState([]);
  const [usersNames, setUsersNames] = useState([]);

  const [selectedOfficeReservation, setSelectedOfficeReservation] = useState([[]]);
  const [selectedOfficesReservations, setSelectedOfficesReservations] = useState([[]]);

  const getCompany = (id) => {
    return companies?.find((el) => el["_id"] === id);
  };

  const getOffice = (id) => {
    return offices?.find((el) => el["_id"] === id);
  };

  const getUserProject = (userEmail) => {
    return projects?.find((project) => project.users?.find((user) => user === userEmail))?.project_name;
  };

  const getUserName = (userEmail) => {
    return usersNames?.find((e) => e.email === userEmail)?.full_name;
  };

  const getUsersProjects = (users) => {
    let usersProjects = [];
    users?.forEach((u) => usersProjects.push({ user: u, project: getUserProject(u) }));
    console.log({ usersProjects });
    const groups = usersProjects?.reduce((groups, item) => {
      const group = groups[item.project] || [];
      group.push(item);
      groups[item.project] = group;
      return groups;
    }, {});

    usersProjects = [];
    for (const [key, value] of Object.entries(groups)) {
      usersProjects.push({ project: key, users: groups[key].map((e) => e.user) });
    }
    return usersProjects;
  };

  const getNumOfSeatsInCompany = () => {
    let num = 0;
    offices.forEach((e) => (num += e["num_of_seats"]));
    return num;
  };

  console.log({ user });
  console.log({ mongoUser });

  useEffect(() => {
    async function initialNavigate() {
      if (user) {
        let result = await getUser(user.email, setIsLoading, t);
        console.log({ result });
        if (result.status === 200) {
          let u = result.user;
          if (!!u) {
            if (u.admin) {
              navigate("/adminHomePage");
            } else {
              navigate("/clientHomePage");
              return;
            }
          }
        }
      } else {
        navigate("/");
      }
    }
    initialNavigate();
  }, [user]);

  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  useEffect(() => {
    const getMongoUser = async () => {
      if (user) {
        const result = await getUser(user.email, setIsLoading, t);
        console.log({ result });
        if (result.status === 200) {
          const mongoDBUser = result.user;
          setMongoUser(mongoDBUser);
        }
      } else {
        setMongoUser(null);
      }
    };
    getMongoUser();
  }, [user]);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <GlobalContext.Provider
      value={{
        isLoading,
        setIsLoading,
        user,
        mongoUser,
        companies,
        setCompanies,
        selectedCompanyId,
        setSelectedCompanyId,
        selectedCompany,
        setSelectedCompany,
        getCompany,
        offices,
        setOffices,
        selectedOffice,
        setSelectedOffice,
        getOffice,
        projects,
        setProjects,
        getUserProject,
        getUsersProjects,
        selectedOfficeReservation,
        setSelectedOfficeReservation,
        selectedOfficesReservations,
        setSelectedOfficesReservations,
        usersNames,
        setUsersNames,
        getUserName,
        countryLocale,
        setCountryLocale,
        getNumOfSeatsInCompany,
        toggleSidebar,
        sideBar,
        logout,
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ToastContainer
          autoClose={2000}
          position="top-center"
          className="toast-container"
          toastClassName="dark-toast"
        />
        {isLoading && (
          <div className="spinner-container">
            <LoadingSpinner />
          </div>
        )}
        <div className="container">
          <SideBar />

          <div className="main-content">
            <NavBar />
            <div className="page-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/adminHomePage" element={<AdminHomePage />} />
                <Route path="/adminAddCompany" element={<AdminAddCompany />} />
                <Route path="/adminCompanyDetails" element={<AdminCompanyDetails />} />
                <Route path="/adminUpdateCompany" element={<AdminUpdateCompany />} />
                <Route path="/adminAddOffice" element={<AdminAddOffice />} />
                <Route path="/adminOffices" element={<AdminOffices />} />
                <Route path="/adminOfficeDetails" element={<AdminOfficeDetails />} />
                <Route path="/adminUpdateOffice" element={<AdminUpdateOffice />} />
                <Route path="/adminProjects" element={<AdminProjects />} />
                <Route path="/adminWorkersMainPage" element={<AdminWorkersMainPage />} />
                <Route path="/adminWorkersInviteUser" element={<AdminWorkersInviteUser />} />
                <Route path="/adminSeatingChart" element={<AdminSeatingChart />} />
                <Route path="/adminAnalysis" element={<AdminAnalysis />} />

                <Route path="/clientHomePage" element={<ClientHomePage />} />
                <Route path="/clientCompanyDetails" element={<ClientCompanyDetails />} />
                <Route path="/clientCoworkers" element={<ClientCoworkers />} />
                <Route path="/clientReserveTable" element={<ClientReserveTable />} />
                <Route path="/clientSeatingChart" element={<ClientSeatingChart />} />
              </Routes>
            </div>
          </div>
        </div>
      </LocalizationProvider>
    </GlobalContext.Provider>
  );
}

export default App;
