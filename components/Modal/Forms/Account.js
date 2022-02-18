import React from "react";
import InputField from "../FormFields/InputField";
import SelectField from "../FormFields/SelectField";
import { languages, countryList } from "../../../utils/HelperData";

function Account(props) {
  const {
    formField: { orgName, numPeople, location, language },
  } = props;
  return (
    <React.Fragment>
      <InputField
        label={orgName.label}
        name={orgName.name}
        placeholder="Enter Organization Name"
      />
      <SelectField
        label={numPeople.label}
        name={numPeople.name}
        options={[1, 2, 3, 4, 5, 6]}
      />
      <SelectField
        label={location.label}
        name={location.name}
        options={countryList}
      />
      <SelectField
        label={language.label}
        name={language.name}
        options={[...languages.map((lang) => lang.name)]}
      />
    </React.Fragment>
  );
}

export default Account;
