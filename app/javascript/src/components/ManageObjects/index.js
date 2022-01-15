import React from "react";
import { Switch, Route } from "react-router-dom";
import PrivateRoute from "../Generic/PrivateRoute";
import EditObjectWithData from "./EditObject";
import ListObjects from "./ListObjects";
import ListObjectTypes from "./ListObjectTypes";


const ManageObjectsRouter = () => {
  return (
    <Switch>
      {/* <PrivateRoute
        path="/admin/objects/:objectType/new"
        component={NewMailingList}
        action={"manage"}
        subject="all"
      />*/}
      <PrivateRoute
        path="/admin/objects/:objectType/:id/edit"
        component={EditObjectWithData}
        action={"manage"}
        subject="all"
      />
      <PrivateRoute
        path="/admin/objects/:objectType/"
        component={ListObjects}
        action={"manage"}
        subject="all"
      />
      <PrivateRoute
        exact
        path="/admin/objects"
        component={ListObjectTypes}
        action={"manage"}
        subject="all"
      />
    </Switch>
  );
};

export default ManageObjectsRouter;
