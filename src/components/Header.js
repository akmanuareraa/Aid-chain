import React from "react";

function Header(props) {
  return (
    <div className="flex flex-col items-center  py-8">
      <p className="text-custom-primary text-3xl">Aid-Chain</p>
      {props.appState.loggedIn === true ? (
        <p className="text-custom-primary text-sm mt-2">
          Welcome {props.loggedInParty.name} &nbsp;({props.loggedInParty.orgId})
        </p>
      ) : null}
    </div>
  );
}

export default Header;
