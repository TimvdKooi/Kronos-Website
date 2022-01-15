import React from "react";
import { useQuery, useQueryCache } from "react-query";
import DefaultSpinner from "../Generic/Spinner";
import { useHistory } from "react-router-dom";
import EditObjectComponent from "../Generic/EditObjectComponent";
import { getObject, updateObject } from "./queries";
import FormField from "../Generic/FormField";
import { Form } from "react-bootstrap";

import OBJECTTYPES from "./object_types.json";

const EditObjectWithData = ({ match }) => {
  const objectType = match.params.objectType;
  const id = parseInt(match.params.id);
  
  const {
    isLoading,
    isError,
    data: object,
    error,
  } = useQuery(["admin", objectType, id], getObject);
  if (isLoading) {
    return <DefaultSpinner />;
  }
  return object && <EditObject object={object} objectType={objectType} />;
};

const EditObject = ({ object, objectType }) => {
  const queryCache = useQueryCache();
  const history = useHistory();
  const editableFields = {};
  const properties = OBJECTTYPES.find((obj) => obj.name == objectType);
  properties.fields.forEach((field) => {
    editableFields[field.name] = object[field.name];
  });
  const onSuccess = (savedObject) => {
    queryCache.setQueryData(["admin", objectType, savedObject.id], savedObject);
    history.push(`/admin/objects/${objectType}`);
  };

  const ObjectForm = ({ values, setValue, children }) => {
    return (
      <Form>
        {properties.fields.map(({ name, type, required, ...otherProps }) => {
          return (
            <FormField
              {...otherProps}
              key={name}
              modelName={objectType}
              fieldName={name}
              value={values[name]}
              setValue={(v) => setValue(name, v)}
              type={type}
              required={required}
            />
          );
        })}
        {children}
      </Form>
    );
  };

  return (
    <EditObjectComponent
      id={object.id}
      existingObject={editableFields}
      objectName={properties.translationKey}
      updateFunction={updateObject}
      onSuccess={onSuccess}
      FormComponent={ObjectForm}
    />
  );
};

export default EditObjectWithData;
