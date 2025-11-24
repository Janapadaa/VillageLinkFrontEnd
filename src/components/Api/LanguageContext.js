// LanguageContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import RNFS from "react-native-fs";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [languageData, setLanguageData] = useState(null);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const filePath = `${RNFS.DocumentDirectoryPath}/languageData.json`;
        const data = await RNFS.readFile(filePath, "utf8");
        setLanguageData(JSON.parse(data));
      } catch (error) {
        console.log("Language file not found:", error);
      }
    };
    loadLanguage();
  }, []);

  return (
    <LanguageContext.Provider value={{ languageData, setLanguageData }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
