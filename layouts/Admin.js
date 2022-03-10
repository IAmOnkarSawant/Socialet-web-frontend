import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
// reactstrap components
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import routes from "routes.js";
import { useSession } from "next-auth/react";
import { getUserDetails } from "../_api/profile";
import { getSocialAccounts } from "../_api/users";

function Admin(props) {
  // used for checking current route
  const router = useRouter();
  const { data: session } = useSession();
  let mainContentRef = React.createRef();
  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContentRef.current.scrollTop = 0;
  }, []);
  const getBrandText = () => {
    for (let i = 0; i < routes.length; i++) {
      if (router.route.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  const [user, setUser] = useState({});
  const [accounts, setAccounts] = useState({});
  const [isAccountsLoaded, setIsAccountsLoaded] = useState(false);

  useEffect(() => {
    setIsAccountsLoaded(false);
    if (session?.token?.sub) {
      getSocialAccounts(session.token?.sub).then(({ data: accnts }) => {
        setAccounts({ ...accnts });
        setIsAccountsLoaded(true);
      });
    }
  }, [session?.token?.sub]);

  const getUser = useCallback(
    (user_id) => {
      getUserDetails(user_id).then(({ data: { profile } }) => {
        console.log(profile);
        setUser({ ...profile });
      });
    },
    [session?.token?.sub]
  );

  useEffect(() => {
    if (
      session?.token?.sub &&
      accounts &&
      !!!accounts["twitter"] &&
      !!isAccountsLoaded
    ) {
      getUser(session?.token?.sub);
    }
  }, [session?.token?.sub]);

  return (
    <>
      <Sidebar
        {...props}
        routes={routes}
        logo={{
          innerLink: "/admin/index",
          imgSrc: require("assets/img/brand/nextjs_argon_black.png"),
          imgAlt: "...",
        }}
      />
      <div className="main-content" ref={mainContentRef}>
        {session?.token?.sub &&
          accounts &&
          !!!accounts["twitter"] &&
          !!isAccountsLoaded && (
            <AdminNavbar {...props} user={user} brandText={getBrandText()} />
          )}
        {props.children}
      </div>
    </>
  );
}

export default Admin;
