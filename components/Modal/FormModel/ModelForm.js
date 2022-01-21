export default {
	formId: "NewUserForm",
	formField: {
		orgName: {
			name: "orgName",
			label: "What is name of your organization?",
			requiredErrorMsg: "organization name is required",
		},
		numPeople: {
			name: "numPeople",
			label: "How many people work there?",
			requiredErrorMsg: "please, mention number of people in your organization",
		},
		location: {
			name: "location",
			label: "Where are you located?",
			requiredErrorMsg: "location is required",
		},
		language: {
			name: "language",
			label: "What is your preffered language?",
			requiredErrorMsg: "preffered language is required",
		},
		role: {
			name: "role",
			label: "Which best described your role?",
			requiredErrorMsg: "role is required",
		},
		hereFor: {
			name: "hereFor",
			label: "I'm here for: (Select all that apply)",
		},
	},
};
