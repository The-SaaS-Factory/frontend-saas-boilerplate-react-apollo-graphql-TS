/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Switch } from "@headlessui/react";

import { toast } from "sonner";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  ArchiveBoxArrowDownIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

import ImageUploading from "react-images-uploading";
//Add ul
const modules = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
  ],
};
const formats = ["header", "bold", "italic", "underline", "indent", "list"];

type FormInfo = {
  name: string;
  description: string;
};

export type Field = {
  name: string;
  label: string;
  type: string;
  slug?: string;
  numberStep?: string;
  note?: string;
  required: boolean;
  options?: FieldSelectOption[];
};

type FieldSelectOption = {
  optionValue: string;
  optionName: string;
};

type FormProps = {
  values: any;
  info: FormInfo | null;
  fields: Field[];
  onSubmit: SubmitHandler<() => void>;
  onAddNewField?: (data: Field) => void;
  newFieldsFunction?: boolean;
  autoSave?: boolean;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const NewForm = ({
  values,
  info,
  fields,
  onSubmit,
  onAddNewField,
  newFieldsFunction = false,
  autoSave = false,
}: FormProps) => {
  //States
  const { handleSubmit, register, setValue, watch } = useForm();

  const [newFieldData, setNewFieldData] = useState({
    name: "",
    label: "",
    type: "text",
    required: false,
  });

  const [mapSelectorsOpen, setMapSelectorsOpen] = useState({});

  //Funtions

  const openMapSelector = (fieldName: any) => {
    setMapSelectorsOpen({
      ...mapSelectorsOpen,
      [fieldName]: true,
    });
  };

  const closeMapSelector = (fieldName: any) => {
    setMapSelectorsOpen({
      ...mapSelectorsOpen,
      [fieldName]: false,
    });
  };

  const handleNewFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setNewFieldData({
      ...newFieldData,
      [name]: fieldValue,
    });
  };

  const handleAddNewField = () => {
    if (!newFieldData.name || !newFieldData.label) {
      return toast.error("Name and Label are required");
    }

    if (newFieldData.type == "list") {
      newFieldData.name += "list";
    }

    onAddNewField && onAddNewField(newFieldData);

    setNewFieldData({
      name: "",
      label: "",
      type: "text",
      required: false,
    });
  };

  useEffect(() => {
    if (Array.isArray(values)) {
      values.forEach((value: any) => {
        const field = fields.find((f: any) => f.name === value.settingName);

        if (field) {
          setValue(field.name, value.settingValue);
        }
      });
    } else if (typeof values === "object") {
      for (const fieldName in values) {
        const field = fields.find((f: any) => f.name === fieldName);

        if (field) {
          if (typeof values[fieldName] === "object") {
            //Fix Add fields names
            const images = values[fieldName]?.map((i: any) => {
              return i.image;
            });
            setValue(field.name, images);
          } else {
            setValue(fieldName, values[fieldName]);
          }
        }
      }
    }
  }, [values, fields]);

  const handleSendForm = (data: any) => {
    onSubmit(data);
  };

  return (
    <>
      <form className="w-full" onSubmit={handleSubmit(handleSendForm)}>
        <div className="space-y-12">
          <div
            className={`grid grid-cols-1 gap-x-8        ${
              info && "md:grid-cols-3"
            }`}
          >
            {info && (
              <div className="lg:col-span-1 p-7">
                <h2 className="text-subtitle">{info.name}</h2>
                <p className="mt-3 text-sm leading-6 text-primary">
                  {info.description}
                </p>
              </div>
            )}
            <div className="lg:col-span-2 flex flex-col text-primary">
              {fields.map((field, index) => (
                <div
                  className={`  my-3 flex max-w-md  ${
                    field.type === "toggle"
                      ? "flex-row justify-between "
                      : "flex-col "
                  } `}
                  key={index}
                >
                  <label
                    htmlFor={field.name}
                    className="text-primary font-medium"
                  >
                    {field.label}
                  </label>
                  {field.type === "text" && (
                    <div className="mt-2  ">
                      <div className="flex flex-col rounded-md shadow-sm ">
                        <TextInput
                          onValueChange={(value) => setValue(field.name, value)}
                          value={watch(field.name)}
                          id={field.name}
                        />
                      </div>
                      {field.note && (
                        <div className="italic ">
                          <p className="text-sm text-gray-500">{field.note}</p>
                        </div>
                      )}
                    </div>
                  )}
                  {field.type === "number" && (
                    <div className="mt-2  ">
                      <div className="flex flex-col rounded-md shadow-sm  ">
                        <NumberInput
                          onValueChange={(value) => setValue(field.name, value)}
                          value={watch(field.name)}
                          id={field.name}
                        />
                      </div>
                      {field.note && (
                        <div className="italic ">
                          <p className="text-sm text-gray-500">{field.note}</p>
                        </div>
                      )}
                    </div>
                  )}
                  {field.type === "date" && (
                    <div className="mt-2  ">
                      <div className="flex flex-col rounded-md shadow-sm">
                        <DatePicker
                          onValueChange={(value) => setValue(field.name, value)}
                          value={watch(field.name)}
                          id={field.name}
                        />
                      </div>
                      {field.note && (
                        <div className="italic ">
                          <p className="text-sm text-gray-500">{field.note}</p>
                        </div>
                      )}
                    </div>
                  )}
                  {field.type === "slug" && (
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm">
                        <TextInput
                          onValueChange={(value) =>
                            setValue(field.name, slugify(value))
                          }
                          value={slugify(watch(field.name ?? "name"))}
                          id={field.name}
                        />
                      </div>
                    </div>
                  )}
                  {field.type === "textarea" && (
                    <div className="mt-2 mb-14">
                      <div className=" sm:">
                        <ReactQuill
                          theme="snow"
                          value={watch(field.name)}
                          onChange={(c) => setValue(field.name, c)}
                          modules={modules}
                          className="h-32"
                          formats={formats}
                        />
                      </div>
                    </div>
                  )}

                  {field.type === "toggle" && (
                    <Switch.Group as="div" className="flex   ">
                      <Switch
                        checked={watch(field.name) === "true" ? true : false}
                        onChange={(isChecked) => {
                          console.log(isChecked.toString());

                          setValue(field.name, isChecked.toString());
                        }}
                        className={classNames(
                          (watch(field.name) === "true" ? true : false)
                            ? "bg-indigo-600"
                            : "bg-gray-200",
                          "relative inline-flex h-6 w-11   flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={classNames(
                            (watch(field.name) === "true" ? true : false)
                              ? "translate-x-5"
                              : "translate-x-0",
                            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out text"
                          )}
                        />
                      </Switch>
                    </Switch.Group>
                  )}
                  {field.type === "select" && (
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm">
                        {/* <select
                          {...register(field.name, {
                            required: field.required,
                          })}
                          name={field.name}
                          id={field.name}
                          className="input-text"
                        >
                          {field.options?.map(
                            (option: FieldSelectOption, index: number) => (
                              <option
                                value={option.optionValue}
                                key={`option-${index}`}
                              >
                                {option.optionName}
                              </option>
                            )
                          )}
                        </select> */}

                        <SearchSelect
                          onValueChange={(value) => setValue(field.name, value)}
                          value={watch(field.name)}
                          id={field.name}
                        >
                          {field.options?.map(
                            (option: FieldSelectOption, index: number) => (
                              <SearchSelectItem
                                value={option.optionValue}
                                key={`option-${index}`}
                              >
                                {option.optionName}
                              </SearchSelectItem>
                            )
                          )}
                        </SearchSelect>
                      </div>
                    </div>
                  )}

                  {field.type === "list" && (
                    <ListFeatureField
                      itemsOnEdit={watch(field.name)}
                      name={field.name}
                      fields={fields}
                      label={field.label}
                      onAddFeatureList={(item) => setValue(field.name, item)}
                    />
                  )}

                  {field.type === "image" && (
                    <>
                      <ImageUploading
                        value={watch(field.name)}
                        onChange={(item) => setValue(field.name, item)}
                        maxNumber={1}
                        dataURLKey="data_url"
                      >
                        {({
                          imageList: imageListAvatar,
                          onImageUpload: onImageUploadAvatar,
                          onImageRemoveAll: onImageRemoveAllAvatar,
                          dragProps: dragPropsAvatar,
                        }) => (
                          // write your building UI
                          <div className="upload__image-wrapper">
                            <div className="col-span-full">
                              <div className="mt-2 flex items-center gap-x-3">
                                <div onClick={onImageRemoveAllAvatar}>
                                  {!imageListAvatar[0] ? (
                                    <div className="flex items-center space-x-3">
                                      <PhotoIcon
                                        className="h-10 w-10 text-gray-300"
                                        aria-hidden="true"
                                      />
                                      <button
                                        onClick={(e) => {
                                          e.preventDefault();
                                          onImageUploadAvatar();
                                        }}
                                        {...dragPropsAvatar}
                                        type="button"
                                        className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                      >
                                        Change
                                      </button>
                                    </div>
                                  ) : (
                                    <div>
                                      {typeof imageListAvatar === "string" ? (
                                        <img
                                          src={imageListAvatar}
                                          className="h-12 w-12 rounded-full"
                                        />
                                      ) : (
                                        <div key={index} className="image-item">
                                          <img
                                            src={
                                              imageListAvatar[0].data_url ?? ""
                                            }
                                            className="h-12 w-12 rounded-full"
                                          />
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            &nbsp;
                          </div>
                        )}
                      </ImageUploading>
                      {field.note && (
                        <div className="italic ">
                          <p className="text-sm text-gray-500">{field.note}</p>
                        </div>
                      )}
                    </>
                  )}
                  {field.type === "mapSelector" && (
                    <div className="mt-2  ">
                      <div className="flex  rounded-md shadow-sm">
                        <input
                          {...register(field.name, {
                            required: field.required,
                          })}
                          type={"text"}
                          name={field.name}
                          step="0.01"
                          id={field.name}
                          className="input-text"
                        />
                        <button
                          className="btn-main"
                          onClick={(e) => {
                            e.preventDefault();
                            openMapSelector(field.name);
                          }}
                        >
                          <MapPinIcon className="h-5 w-5" />
                        </button>
                      </div>
                      {field.note && (
                        <div className="italic ">
                          <p className="text-sm text-gray-500">{field.note}</p>
                        </div>
                      )}

                      <MapSelector
                        openModal={
                          mapSelectorsOpen[
                            field.name as keyof typeof mapSelectorsOpen
                          ] ?? false
                            ? true
                            : false
                        }
                        address={watch(field.name) ?? null}
                        onClose={() => closeMapSelector(field.name)}
                        // onSelect={(address: string | null) => {
                        //   setValue(field.name, address);
                        //   closeMapSelector(field.name);
                        // }}
                        handleChangeAddress={(address) => {
                          setValue(field.name, address);
                        }}
                      />
                    </div>
                  )}
                  {field.type === "gallery" && (
                    <>
                      <ImageUploading
                        multiple
                        value={watch(field.name)}
                        onChange={(items) => {
                          const currentImages = watch(field.name) || [];
                          const updatedImages = currentImages.slice(); // Create a copy of the current images

                          items.forEach((newImage) => {
                            // Check if the new image already exists in the current list
                            const existingImageIndex = updatedImages.findIndex(
                              (img: any) => img.data_url === newImage.data_url
                            );

                            if (existingImageIndex !== -1) {
                              // If it exists, update the existing image
                              updatedImages[existingImageIndex] = newImage;
                            } else {
                              // If it doesn't exist, add the new image to the list
                              updatedImages.push(newImage);
                            }
                          });

                          // Set the updated list of images in the form state
                          setValue(field.name, updatedImages);
                        }}
                        maxNumber={10}
                        dataURLKey="data_url"
                      >
                        {({
                          imageList,
                          onImageUpload,
                          onImageRemove,
                          dragProps: dragPropsAvatar,
                        }) => (
                          <div className="">
                            <div className="col-span-full">
                              <div className="mt-2   items-center gap-x-3">
                                <div
                                  className="col-span-full"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    onImageUpload();
                                  }}
                                  {...dragPropsAvatar}
                                >
                                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                    <div className="text-center">
                                      <PhotoIcon
                                        className="mx-auto h-12 w-12 text-gray-300"
                                        aria-hidden="true"
                                      />
                                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                        <label
                                          htmlFor="file-upload"
                                          className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                        >
                                          <span> {"Add"}</span>
                                          <input
                                            id="file-upload"
                                            name="file-upload"
                                            type="file"
                                            className="sr-only"
                                          />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                      </div>
                                      <p className="text-xs leading-5 text-gray-600">
                                        PNG, JPG, GIF up to 10MB
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-wrap">
                                  {imageList.map((image, index) => (
                                    <div key={index} className="image-item">
                                      <img
                                        onClick={(e) => {
                                          e.preventDefault();
                                          onImageRemove(index);
                                        }}
                                        src={image.data_url ?? image}
                                        alt=""
                                        className="rounded-lg shadow-lg m-2  w-16 h-16 object-cover"
                                      />
                                      <div className="image-item__btn-wrapper">
                                        <button
                                          onClick={(e) => {
                                            e.preventDefault();
                                            const currentImages = watch(
                                              field.name
                                            );
                                            const updatedImages =
                                              currentImages.slice(); // Create a copy of the current images
                                            updatedImages.splice(index, 1); // Remove the image at the specified index
                                            setValue(field.name, updatedImages);
                                          }}
                                          className="icon "
                                        >
                                          <ArchiveBoxArrowDownIcon className="h-5 w-5" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}

                                  {/* <div className="flex items-center space-x-3">
                                    <PhotoIcon
                                      className="h-10 w-10 text-gray-300"
                                      aria-hidden="true"
                                    />
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        onImageUpload();
                                      }}
                                      {...dragPropsAvatar}
                                      type="button"
                                      className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                    >
                                      {t("Add")}
                                    </button>
                                  </div> */}
                                </div>
                              </div>
                            </div>
                            &nbsp;
                          </div>
                        )}
                      </ImageUploading>
                      {field.note && (
                        <div className="italic ">
                          <p className="text-sm text-gray-500">{field.note}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}

              {newFieldsFunction && (
                <>
                  <div className="mt-6 bg-gray-50 flex flex-col rounded-md shadow-sm">
                    <h3 className="text-subtitle p-3">Add New Field</h3>
                    <div className="flex px-3 space-x-3 items-center">
                      <input
                        type="text"
                        name="name"
                        className="input-text"
                        placeholder="Field Name"
                        value={newFieldData.name}
                        onChange={handleNewFieldChange}
                      />
                      <input
                        type="text"
                        name="label"
                        className="input-text"
                        placeholder="Field Label"
                        value={newFieldData.label}
                        onChange={handleNewFieldChange}
                      />
                      <select
                        className="input-text"
                        onChange={(e) => {
                          setNewFieldData({
                            ...newFieldData,
                            ["type"]: e.target.value,
                          });
                        }}
                        value={newFieldData.type}
                      >
                        <option value="">Select</option>
                        <option value="list">List</option>
                        <option value="text">Text</option>
                        <option value="textarea">TextArea</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      className="btn-secundary p-3 ml-auto"
                      onClick={handleAddNewField}
                    >
                      <span>Add Field</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        {!autoSave && (
          <div className="mt-6 max-w-5xl flex items-center justify-end gap-x-6 pr-7">
            <button type="submit" className="btn-main">
              Guardar
            </button>
          </div>
        )}
        <hr className="my-4" />
        <br />
      </form>
    </>
  );
};

type ListFeatureFieldProps = {
  name: string;
  label: string;
  itemsOnEdit: any;
  fields: any;
  onAddFeatureList: (item: any) => void;
};

const ListFeatureField: React.FC<ListFeatureFieldProps> = ({
  itemsOnEdit,
  fields,
  onAddFeatureList,
}) => {
  console.log(itemsOnEdit);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (Array.isArray(itemsOnEdit)) {
      setItems(itemsOnEdit); // Load the items for editing
    } else if (typeof itemsOnEdit === "object") {
      const updatedItems: any = [];

      for (const fieldName in itemsOnEdit) {
        const field = fields.find((f: Field) => f.name === fieldName);

        if (field) {
          updatedItems.push({
            Name: field.label, // Example: You can customize this based on your data structure
            Description: itemsOnEdit[fieldName], // Example: You can customize this based on your data structure
          });
        }
      }

      setItems(updatedItems);
    }
  }, [itemsOnEdit, fields]);

  const [addMore, setAddMore] = useState(itemsOnEdit > 0 ? itemsOnEdit : []);
  const [newItem, setNewItem] = useState<{ [key: string]: string }>({});

  const handleAddItem = () => {
    if (Object.keys(newItem).length === 0) return; // No fields added
    setItems([...items, newItem]);
    // Notify the parent component
    setNewItem({});
  };

  const saveList = () => {
    toast.success("List saved");
    onAddFeatureList(items);
    setAddMore(false);
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    console.log(value);

    setNewItem({
      ...newItem,
      [fieldName]: value,
    });
  };
  const handleFieldChangeOnEdit = (
    fieldName: string,
    value: string,
    index: number
  ) => {
    console.log();

    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      const editedItem = { ...updatedItems[index] };
      editedItem[fieldName] = value;
      updatedItems[index] = editedItem;
      return updatedItems;
    });
  };

  return (
    <div className="ml-3 p-3 border-2 rounded-xl">
      {items.map((item, index) => (
        <div key={index}>
          {Object.entries(item).map(([field, valueField]) => (
            <div key={field}>
              <label>{field}</label>
              <input
                type="text"
                className="input-text"
                value={valueField as string}
                onChange={(e) => {
                  handleFieldChangeOnEdit(field, e.target.value, index);
                }}
              />
            </div>
          ))}
        </div>
      ))}

      {items.length > 0 && (
        <button
          onClick={(e) => {
            e.preventDefault();
            saveList();
          }}
          className="btn-main m-3 mx-auto flex"
        >
          Save list
        </button>
      )}
      {addMore ? (
        <div
          className="mt-6 bg-gray-50 flex flex-col 
       rounded-md shadow-sm ring-1 ring-inset
        ring-gray-300 focus-within:ring-2 
        focus-within:ring-inset focus-within:ring-indigo-600  "
        >
          <h3 className="text-subtitle p-3">Add New Item </h3>
          <div className="flex flex-col px-3 space-y-2  items-center">
            <input
              type="text"
              name="name"
              className="input-text"
              placeholder="Feature Name"
              value={newItem.Name || ""}
              onChange={(e) => handleFieldChange("Name", e.target.value)}
            />
            <input
              type="text"
              name="label"
              className="input-text"
              placeholder="Feature Description"
              value={newItem.Description || ""}
              onChange={(e) => handleFieldChange("Description", e.target.value)}
            />
          </div>
          <button
            type="button"
            className="btn-secundary p-3 ml-auto"
            onClick={handleAddItem}
          >
            <span>Add Feature</span>
          </button>
        </div>
      ) : (
        <button
          onClick={(e) => {
            e.preventDefault();
            setAddMore(true);
          }}
          className="btn-main m-3 mx-auto flex"
        >
          Edit list
        </button>
      )}
    </div>
  );
};

import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { LoadScript, GoogleMap, MarkerF } from "@react-google-maps/api";
import { MapPinIcon } from "@heroicons/react/24/outline";

import { slugify } from "@/utils/facades/strFacade";
import {
  DatePicker,
  NumberInput,
  SearchSelect,
  SearchSelectItem,
  TextInput,
} from "@tremor/react";

export function MapSelector({
  openModal,
  address,
  handleChangeAddress,
  onClose,
}: {
  openModal: boolean;
  address: string | null;
  handleChangeAddress: (address: string) => void;
  onClose: () => void;
}) {
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  //States
  const map = useRef(null);
  const [open, setOpen] = useState(false);
  const [latLng, setLatLng] = useState({ lat: 38.7253, lng: -9.15 });
  const [addressValue, setAddressValue] = useState(address ?? null);

  //Center capital portugal
  const [center, setCenter] = useState({ lat: 38.7253, lng: -9.15 });
  useEffect(() => {
    setLatLng({ lat: center.lat, lng: center.lng });
  }, [center]);

  const [isScriptLoaded, setScriptLoaded] = useState(false);
  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  //Hooks
  useEffect(() => {
    setOpen(openModal);

    return () => {
      setOpen(false);
    };
  }, [openModal]);

  useEffect(() => {
    setAddressValue(address);
  }, [address]);

  useEffect(() => {
    if (address && !latLng) {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${googleMapsApiKey}`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (data.results.length > 0) {
            const location = data.results[0].geometry.location;

            setCenter({
              lat: location.lat,
              lng: location.lng,
            });
            setLatLng({
              lat: location.lat,
              lng: location.lng,
            });
            console.log("setIsLoaded", "true");
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
  }, [openModal]);

  //Functions

  const handleAddressChange = (e: any) => {
    setAddressValue(e.target.value);
    handleChangeAddress(e.target.value);
  };

  const handleMarkerDragEnd = (e: any) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    // Aquí actualizas la latitud y la longitud en el estado.
    setLatLng({ lat, lng });

    //If address Value already has lat and lng, remove it
    const addressValueSplit = addressValue?.split("---") ?? [];
    const addressValueWithoutLatLng =
      (addressValueSplit && addressValueSplit[0]) ?? "";

    //Set new address value
    const finalAddress = addressValueWithoutLatLng + "---" + `${lat},${lng}`;

    setAddressValue(finalAddress);

    handleChangeAddress(finalAddress);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-40" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <MapPinIcon
                      className="h-6 w-6 text-green-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text"
                    >
                      Select Address
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {latLng && (
                          <input
                            type="text"
                            placeholder="Address"
                            className="input-text"
                            onChange={handleAddressChange}
                            value={addressValue as string}
                          />
                        )}
                      </p>

                      {addressValue && (
                        <div>
                          {window.google === undefined ? (
                            <LoadScript
                              ref={map}
                              googleMapsApiKey={googleMapsApiKey}
                              onLoad={() => {
                                console.log("setScriptLoaded", "true");

                                setScriptLoaded(true);
                              }}
                            >
                              {isScriptLoaded && (
                                <div className="relative">
                                  <GoogleMap
                                    key={Date.now()}
                                    mapContainerStyle={mapContainerStyle}
                                    center={center}
                                    zoom={15}
                                  >
                                    <MarkerF
                                      position={latLng}
                                      draggable={true}
                                      onDragEnd={(e) => handleMarkerDragEnd(e)}
                                    />
                                  </GoogleMap>

                                  <div className="  absolute top-1 left-1 w-full  ">
                                    <div className="bg-white shadow-md p-3 space-x-3 flex rounded m-1 absolute top-1 left-1">
                                      <MapPinIcon className="h-5 w-5 text-gray-500" />
                                      <p>{address}</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </LoadScript>
                          ) : (
                            <div className="relative">
                              <GoogleMap
                                key={Date.now()}
                                mapContainerStyle={mapContainerStyle}
                                center={center}
                                zoom={15}
                              >
                                <MarkerF
                                  position={latLng}
                                  draggable={true}
                                  onDragEnd={(e) => handleMarkerDragEnd(e)}
                                />
                              </GoogleMap>

                              <div className="  absolute top-1 left-1 w-full  ">
                                <div className="bg-white shadow-md p-3 space-x-3 flex rounded m-1 absolute top-1 left-1">
                                  <MapPinIcon className="h-5 w-5 text-gray-500" />
                                  <p>{address}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={onClose}
                  >
                    Selecione o endereço
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default NewForm;

export const parseDataOnSubmit = async (data: any, fields: any) => {
  const serverURL = import.meta.env.VITE_SERVER_BASE_URL;

  const payload: any = {};
  const promises = fields.map(async (field: any) => {
    const fieldName = field.name;
    let fieldValue = data[fieldName];

    payload[fieldName] = fieldValue;

    if (fieldValue !== undefined) {
      if (field.type === "number") {
        payload[fieldName] = parseFloat(fieldValue);
      } else if (field.type === "image") {
        if (typeof fieldValue === "string" && fieldValue.includes("http")) {
          payload[fieldName] = fieldValue;
        } else {
          if (fieldValue && fieldValue.length > 0) {
            if (!serverURL) return console.log("Server URL not found");
            const response = await fetch(serverURL + "/api/v1/saveImage", {
              method: "POST",
              mode: "cors",
              body: JSON.stringify((fieldValue[0] as any)?.data_url),
            }).catch((e) => console.log(e));
            if (response) {
              const responseF = await response.json();
              payload[fieldName] = responseF.url;
            } else {
              payload[fieldName] = null;
            }
          }
        }
      } else if (field.type === "gallery") {
        if (fieldValue && fieldValue.length > 0) {
          const images = fieldValue
            .filter((f: any) => f.data_url)
            .map((image: any) => image.data_url);

          if (images.length > 0) {
            const response = await fetch(serverURL + "/api/v1/saveImage", {
              method: "POST",
              mode: "cors",
              body: JSON.stringify(images),
            }).catch((e) => console.log(e));
            if (response) {
              const responseF = await response.json();

              //Add image on update without data_url
              const imagesUpdate = fieldValue.filter((f: any) => !f.data_url);

              console.log(responseF.concat(imagesUpdate));

              payload[fieldName] = JSON.stringify(
                responseF.concat(imagesUpdate)
              );
            } else {
              payload[fieldName] = null;
            }
          } else {
            payload[fieldName] = JSON.stringify(fieldValue);
          }
        } else {
          payload[fieldName] = JSON.stringify(fieldValue);
        }
      } else if (field.type === "textarea") {
        //count all images base64
        const images = fieldValue
          ? fieldValue.match(/data:image\/[^;]+;base64[^"]*/g)
          : null;
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
