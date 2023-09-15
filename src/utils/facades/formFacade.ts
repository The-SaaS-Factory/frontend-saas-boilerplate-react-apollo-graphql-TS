import { Field } from "../../components/commons/NewForm";
import { Image, SuperAdminSetting } from "../../types/Types";
import { serverURL } from "../serverUrl";

export const parseSettingDataOnSubmit = (data, fields) => {
  let payload: SuperAdminSetting[] = [];

  fields.forEach((field: Field) => {
    const fieldName = field.name;
    const fieldValue = data[fieldName];

    if (fieldValue !== undefined) {
      payload.push({
        settingName: fieldName,
        settingValue: fieldValue,
      });
    }
  });

  return payload;
};

export const parseDataOnSubmit = async (data, fields) => {
  let payload = {};
  console.log(data);

  const promises = fields.map(async (field) => {
    const fieldName = field.name;
    let fieldValue = data[fieldName];

    payload[fieldName] = fieldValue;

    if (fieldValue !== undefined) {
      if (field.type === "number") {
        console.log(typeof fieldValue);
        payload[fieldName] = parseFloat(fieldValue);
      } else if (field.type === "image") {
        if (fieldValue && fieldValue.length > 0) {
          const response = await fetch(serverURL + "/v1/saveImage", {
            method: "POST",
            mode: "cors",
            body: JSON.stringify((fieldValue[0] as Image)?.data_url),
          }).catch((e) => console.log(e));

          if (response) {
            const responseF = await response.json();
            payload[fieldName] = responseF.url;
          } else {
            payload[fieldName] = null;
          }
        }
      } else if (field.type === "textarea") {
        //count all images base64
        const images = fieldValue.match(/data:image\/[^;]+;base64[^"]*/g);
        const imagesCount = images ? images.length : 0;
        //Save each image on server and replace base64 with url
        for (let i = 0; i < imagesCount; i++) {
          //image with base64 structure
          const image = images[i];

          const response = await fetch(serverURL + "/v1/saveImage", {
            method: "POST",
            mode: "cors",
            body: JSON.stringify(image),
          });

          if (response) {
            const responseF = await response.json();
            fieldValue = fieldValue.replace(image, responseF.url);
          } else {
            fieldValue = fieldValue.replace(image, "");
          }
        }
        payload[fieldName] = fieldValue;
      }
    }
  });

  await Promise.all(promises);

  return payload;
};
