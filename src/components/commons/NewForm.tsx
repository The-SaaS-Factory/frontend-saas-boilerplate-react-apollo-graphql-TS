import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Switch } from "@headlessui/react";

import { toast } from "sonner";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import ImageUploading from "react-images-uploading";
import { slugify } from "../../utils/facades/strFacade";
const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    ["clean"],
  ],
};
const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];

type FormInfo = {
  name: string;
  description: string;
};

export type Field = {
  name: string;
  label: string;
  type: string;
  slug?: string;
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
  onSubmit: SubmitHandler<any>;
  onAddNewField?: (data: any) => void;
  newFieldsFunction?: boolean;
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const NewForm = ({
  values,
  info,
  fields,
  onSubmit,
  onAddNewField,
  newFieldsFunction = false,
}: FormProps) => {
  const { handleSubmit, register, setValue, watch, reset } = useForm();
  const [enabled, setEnabled] = useState(false);
  const { t } = useTranslation("superadmin");

  const [newFieldData, setNewFieldData] = useState({
    name: "",
    label: "",
    type: "text",
    required: false,
  });

  const handleNewFieldChange = (event) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setNewFieldData({
      ...newFieldData,
      [name]: fieldValue,
    });
  };

  const handleAddNewField = () => {
    if (!newFieldData.name || !newFieldData.label) {
      return toast.error("Error");
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

  const handleAddNewCustomFieldType = (fieldCustom) => {
    onAddNewField && onAddNewField(fieldCustom);
  };

  useEffect(() => {
    if (Array.isArray(values)) {
      values.forEach((value: any) => {
        const field = fields.find((f: Field) => f.name === value.settingName);

        if (field) {
          setValue(field.name, value.settingValue);
        }
      });
    } else if (typeof values === "object") {
      for (const fieldName in values) {
        const field = fields.find((f: Field) => f.name === fieldName);

        if (field) {
          setValue(fieldName, values[fieldName]);
        }
      }
    }
  }, [values, fields]);

  const handleSendForm = (data) => {
    onSubmit(data);
  };

  return (
    <>
      <form className="w-full " onSubmit={handleSubmit(handleSendForm)}>
        <div className="space-y-12">
          <div
            className={`grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 ${
              info && "md:grid-cols-3"
            }`}
          >
            {info && (
              <div className="lg:col-span-1">
                <h2 className="text-base font-semibold leading-7 text">
                  {info.name}
                </h2>
                <p className="mt-1 text-sm leading-6 text">
                  {info.description}
                </p>
              </div>
            )}
            <div className="lg:col-span-2">
              {fields.map((field, index) => (
                <div
                  className={`  my-3 flex ${
                    field.type === "toggle"
                      ? "flex-row justify-between"
                      : "flex-col"
                  } `}
                  key={index}
                >
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium leading-6 text"
                  >
                    {field.label}
                  </label>
                  {(field.type === "text" || field.type === "number") && (
                    <div className="mt-2  ">
                      <div className="flex flex-col rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <input
                          {...register(field.name, {
                            required: field.required,
                          })}
                          type={field.type}
                          name={field.name}
                          step="0.01"
                          id={field.name}
                          className="input-text"
                        />
                      </div>
                        {field.note && (
                          <div className="italic ">
                            <p className="text-sm text-gray-500">
                              {field.note}
                            </p>
                          </div>
                        )}
                    </div>
                  )}
                  {field.type === "slug" && (
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <input
                          value={slugify(watch(field.name ?? "name"))}
                          onChange={(c) =>
                            setValue(field.name, slugify(c.target.value))
                          }
                          type={field.type}
                          name={field.name}
                          id={field.name}
                          className="input-text"
                        />
                      </div>
                    </div>
                  )}
                  {field.type === "textarea" && (
                    <div className="mt-2">
                      <div className=" sm:max-w-md">
                        <ReactQuill
                          theme="snow"
                          value={watch(field.name)}
                          onChange={(c) => setValue(field.name, c)}
                          modules={modules}
                          formats={formats}
                        />
                        {/* <TextArea
                          rows={3}
                          contentText={watch(field.name)}
                          onBlur={null}
                          onFocus={null}
                          onChange={(c) => setValue(field.name, c)}
                        /> */}
                      </div>
                    </div>
                  )}
                  {field.type === "image" && (
                    <div className="mt-2">
                      <div className=" sm:max-w-md"></div>
                    </div>
                  )}
                  {field.type === "toggle" && (
                    <div className="flex  mx-auto pl-20">
                      <Switch.Group as="div" className="">
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
                            "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={classNames(
                              (watch(field.name) === "true" ? true : false)
                                ? "translate-x-5"
                                : "translate-x-0",
                              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                            )}
                          />
                        </Switch>
                      </Switch.Group>
                    </div>
                  )}
                  {field.type === "select" && (
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <select
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
                        </select>
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
                        onImageUpdate,
                        onImageRemove,
                        isDragging,
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
                                      className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                    >
                                      {t("change")}
                                    </button>
                                  </div>
                                ) : (
                                  imageListAvatar.map((image, index) => (
                                    <div key={index} className="image-item">
                                      <img
                                        src={image["data_url"] ?? ""}
                                        className="h-12 w-12 rounded-full"
                                      />
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          </div>
                          &nbsp;
                        </div>
                      )}
                    </ImageUploading>
                  )}
                </div>
              ))}

              {newFieldsFunction && (
                <>
                  <div className="mt-6 bg-gray-50 flex flex-col rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <h3 className="subtitle p-3">Add New Field</h3>
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
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button type="submit" className="btn-main">
            Save
          </button>
        </div>
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
  name,
  label,
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
          <h3 className="subtitle p-3">Add New Item </h3>
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

export default NewForm;
