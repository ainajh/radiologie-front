const ValidationDefaultNoonShouldShow = (stringToCheck: string) => {
  return (
    stringToCheck === "TDM-GENOUX" ||
    stringToCheck === "IRM-CERVEAU" ||
    stringToCheck === "TDM-POIGNET"
  );
};

export default ValidationDefaultNoonShouldShow;
