export default {
  formId: "NewUserForm",
  formField: {
    orgName: {
      name: "orgName",
      label: "What is the name of your organization?",
      requiredErrorMsg: "Organization name is required field.",
    },
    numPeople: {
      name: "numPeople",
      label: "How many people work in your organization?",
      requiredErrorMsg: "Number of People is a required field.",
    },
    location: {
      name: "location",
      label: "Where is your organization located?",
      requiredErrorMsg: "Location is a required field.",
    },
    language: {
      name: "language",
      label: "What is your preferred language?",
      requiredErrorMsg: "Preferred Language is a required field.",
    },
    role: {
      name: "role",
      label: "What best describes your role?",
      requiredErrorMsg: "Role is required a field.",
    },
    hereFor: {
      name: "hereFor",
      label: "I'm here for: (Select all that apply)",
    },
  },
};
