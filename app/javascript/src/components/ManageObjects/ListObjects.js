import React from "react";
import { getObjects, removeObject } from "./queries";
import { useQuery, useQueryCache } from "react-query";
import { Link } from "react-router-dom";
import { Can } from "../../utils/auth-helper";
import { useTranslation } from "react-i18next";
import DefaultSpinner from "../Generic/Spinner";
import ListObjectsComponent from "../Generic/ListObjectsComponent";
import { Button } from "react-bootstrap";
import OBJECTTYPES from './object_types.json';

const ListObjects = ({ match }) => {
  const objectType = match.params.objectType;
  const { t } = useTranslation("generic");
  let {
    isLoading,
    isError,
    data: objects,
    error,
  } = useQuery(['admin', objectType], getObjects);
  const removeFunction = (id) => {
    return removeObject(objectType, id).then(() => {
      queryCache.invalidateQueries(['admin', objectType], { exact: true });
    });
  };

  const objectCount = objects ? objects.length : 0;
  const properties = OBJECTTYPES.find(obj => obj.name == objectType);
  const columns = ["id", properties.fields[0].name]
  return (
    <React.Fragment>
      <h1><Button as={Link} to={'/admin/objects'} size='sm'>back</Button> {t(`models:modelNames.${properties.translationKey}`, { count: objectCount })}</h1>
      <ListObjectsComponent
        columns={columns}
        objects={objects}
        removeFunction={removeFunction}
        modelName={properties.translationKey}
        baseUrl={`/admin/objects/${objectType}`}
      />
      {isLoading && <DefaultSpinner />}
      <Can I="manage" a="all">
        <Button as={Link} to={`/admin/objects/${objectType}/new`}>
          {t("addModel", {
            model: t(`models:modelNames.${properties.translationKey}`, { count: 0 }),
          })}
        </Button>
      </Can>
    </React.Fragment>
  );
};

export default ListObjects;
