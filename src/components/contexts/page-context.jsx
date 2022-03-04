import { useState, createContext, useContext } from "react";

const PageContext = createContext();

const usePageContext = () => useContext(PageContext);

const PageContextProvider = ({ children }) => {
  const [progress, setProgress] = useState(false);
  const [searched, setSearched] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [records, setRecords] = useState([]);
  const [access, setAccess] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [filter, setFilter] = useState(null);

  const contextValue = {
    progress,
    setProgress,
    searched,
    setSearched,
    searchText,
    setSearchText,
    records,
    setRecords,
    access,
    setAccess,
    selectedObject,
    setSelectedObject,
    showModal,
    setShowModal,
    showDetails,
    setShowDetails,
    showSearchModal,
    setShowSearchModal,
    filter,
    setFilter,
  };

  return (
    <PageContext.Provider value={contextValue}>{children}</PageContext.Provider>
  );
};

const useResetContext = () => {
  const {
    setProgress,
    setSearched,
    setSearchText,
    setRecords,
    setAccess,
    setSelectedObject,
    setShowModal,
    setShowDetails,
    setShowSearchModal,
    setFilter,
  } = usePageContext();

  const resetContext = () => {
    setProgress(false);
    setSearched(false);
    setSearchText("");
    setRecords([]);
    setAccess(null);
    setSelectedObject(null);
    setShowModal(false);
    setShowDetails(false);
    setShowSearchModal(false);
    setFilter(null);
  };

  return resetContext;
};

export { PageContextProvider, usePageContext, useResetContext };
