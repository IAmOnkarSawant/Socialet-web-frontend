import Model from "./ModelForm";
const {
  formField: { orgName, numPeople, location, language, role, hereFor },
} = Model;

export default {
  [orgName.name]: "",
  [numPeople.name]: "",
  [location.name]: "",
  [language.name]: "",

  [role.name]: "",
  [hereFor.name]: [],
};
