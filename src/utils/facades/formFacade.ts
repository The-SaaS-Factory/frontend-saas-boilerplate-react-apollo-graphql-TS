import { Field } from "@/components/core/NewForm";
import { SuperAdminSetting } from "@/pages/superAdminPages/superAdminSettingsModule/superAdminSettingTypes";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const parseSettingDataOnSubmit = async (data: any, fields: any) => {
    const serverURL = import.meta.env.VITE_SERVER_BASE_URL;
    try {
      const payload: SuperAdminSetting[] = [];
      const promises = fields.map(async (field: Field) => {
        const fieldName = field.name;
        const fieldValue = data[fieldName];
        let valueFinal: any = fieldValue;
  
        if (fieldValue !== undefined) {
          if (field.type === "image") {
            //  console.log(JSON.stringify(fieldValue[0].data_url));
            // return;
            if (
              fieldValue &&
              fieldValue.length > 0 &&
              typeof fieldValue[0] === "object"
            ) {
              const response = await fetch(serverURL + "/api/v1/saveImage", {
                method: "POST",
                mode: "cors",
                body: fieldValue[0].data_url,
              }).catch((e) => {
                console.log(e);
  
                valueFinal = null;
              });
  
              if (response) {
                const responseF = await response.json();
                valueFinal = responseF.url;
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
  
              const response = await fetch(serverURL + "/api/v1/saveImage", {
                method: "POST",
                mode: "cors",
                body: JSON.stringify(image),
              });
  
              if (response) {
                const responseF = await response.json();
                valueFinal = fieldValue.replace(image, responseF.url);
              } else {
                valueFinal = fieldValue.replace(image, "");
              }
            }
          } else if (field.type === "text") {
            valueFinal = fieldValue.toString();
          }
        }
        if (valueFinal !== undefined) {
          console.log(valueFinal);
          payload.push({
            settingName: fieldName,
            settingValue: valueFinal,
          });
        }
      });
      await Promise.all(promises);
      return payload;
    } catch (error) {
      console.log(error);
    }
  };
  