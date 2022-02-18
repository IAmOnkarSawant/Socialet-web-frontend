import * as Yup from "yup";
import ModelForm from "./ModelForm";

const {
  formField: { orgName, numPeople, location, language, role },
} = ModelForm;

export default [
  Yup.object().shape({
    [orgName.name]: Yup.string().required(`${orgName.requiredErrorMsg}`),
    [numPeople.name]: Yup.string().required(`${numPeople.requiredErrorMsg}`),
    [location.name]: Yup.string().required(`${location.requiredErrorMsg}`),
    [language.name]: Yup.string().required(`${language.requiredErrorMsg}`),
  }),
  Yup.object().shape({
    [role.name]: Yup.string().required(`${role.requiredErrorMsg}`),
  }),
];
