var routes = [
	{
		path: "/dashboard",
		name: "Dashboard",
		icon: "ni ni-tv-2 text-primary",
		layout: "/admin",
	},
	{
		path: "/profile",
		name: "My Profile",
		icon: "ni ni-single-02 text-yellow",
		layout: "/admin",
	},
	{
		path:'/channels',
		name:"Channels",
		icon:"ni ni-single-02 text-yellow",
		layout:"/admin"
	},
	{
		path: "/publish",
		name: "Publish Post",
		icon: "ni ni-send text-primary",
		layout: "/admin",
	},
	{
		path: "/login",
		name: "Login",
		icon: "ni ni-key-25 text-info",
		layout: "/authPages",
	},
	{
		path: "/register",
		name: "Register",
		icon: "ni ni-circle-08 text-pink",
		layout: "/authPages",
	},
];
export default routes;
