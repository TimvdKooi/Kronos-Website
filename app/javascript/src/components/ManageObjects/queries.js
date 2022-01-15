import { restCall } from "../../utils/rest-helper";

async function getObjects(queryKey, objectType) {
  const res = await restCall(`${objectType}`);
  return res.data;
}

async function getObject(queryKey, objectType, id) {
  const res = await restCall(`${objectType}/${id}`);
  return res.data;
}

async function updateObject(objectType, id, data) {
  const res = await restCall(`${objectType}/${id}`, {
    method: "PUT",
    data: { [objectType]: data },
  });
  return res.data;
}

function removeObject(objectType, id) {
  return restCall(`${objectType}/${id}`, { method: "DELETE" });
}

export { getObjects, getObject, updateObject, removeObject };
