import { useEffect } from "react";
import { useState } from "react";
import { useForm, Resolver  } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import { GET_CURRENT_USER_FULL, UPDATE_USER } from "../../../utils/queries";
import { toast } from "sonner";
import {   Image } from "../../../types/Types";
import ImageUploading from "react-images-uploading";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { useDispatch, useSelector } from "react-redux";
import { updateUserInfo } from "../../../redux/authSlice";
import { useTranslation } from "react-i18next";
import LanguagesSetting from "./settings/LanguagesSetting";
import Loading from "../../../components/commons/Loading";
import { serverURL } from "../../../utils/serverUrl";
import NotificationsSetting from "./settings/NotificationsSetting";
import PageName from "../../../components/commons/PageName";

type FormValues = {
  email: string;
  password: string;
  username: string;
  name: string;
  avatar: string;
  cover: string;
  avatar_thumbnail: string;
  phone: string;
  resume: string;
};

const resolver: Resolver<FormValues> = async (values) => {
  return {
    values: values.email ? values : {},
    errors: !values.email
      ? {
          email: {
            type: "required",
            message: "This is required.",
          },
        }
      : {},
  };
};

const SettingProfilePage = () => {
  const { t } = useTranslation("settings");
  const [loading, setLoading] = useState(false);
  const [newTypeUser, setNewTypeUser] = useState("");
  const [images, setImages] = useState([]);
  const [imagesCover, setImagesCover] = useState([]);
  const maxNumber = 1;

  const onChangeAvatar = (imageList, addUpdateIndex) => {
    setImages(imageList);
  };

  const onChangeCover = (imageList, addUpdateIndex) => {
    setImagesCover(imageList);
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ resolver });

  const { data: user, refetch } = useQuery(GET_CURRENT_USER_FULL);
  const [mode, setMode] = useState("view");
  const [avatar, setAvatar] = useState("");
  const [avatarProgress, setAvatarProgress] = useState(0);
  const [avatarTmb, setAvatarTmb] = useState("");
  const [cover, setCover] = useState("");
  const [coverProgress, setCoverProgress] = useState(0);
  const { isSuperAdmin } = useSelector((state: any) => state.auth);
 

  const [tabs, setTabs] = useState([
    { name: t("general"), key: "general", href: "#", current: true },
    { name: t("language"), key: "language", href: "#", current: false },

    {
      name: t("notifications"),
      key: "notifications",
      href: "#",
      current: false,
    },
  ]);
  const dispatch = useDispatch();

  function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
  }
  const [updateUser] = useMutation(UPDATE_USER, {
    onCompleted(data, clientOptions) {
      toast.success(t("profile_updated"));
      refetch();
      setMode("view");
      let payload = {
        id: data.updateUser.id,
        username: data.updateUser.username,
        name: data.updateUser.name,
        email: data.updateUser.email,
        avatar: data.updateUser.avatar,
      };
      setLoading(false);
      dispatch(updateUserInfo(payload));
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const onSubmitUpdate = handleSubmit(async (data, event) => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    setLoading(true);
    event?.preventDefault();
    let urlCover = undefined;
    let urlAvatar = undefined;
    let urlAvatarTmb = undefined;

    
    //Get URL imagen
    if (imagesCover.length > 0) {
      const response = await fetch(serverURL + "/v1/saveImage", {
        method: "POST",
        mode: "cors",
        body: JSON.stringify((imagesCover[0] as Image)?.data_url),
      });

      if (response) {
        const responseF = await response.json();
        urlCover = responseF.url;
      }
    }

    if (images.length > 0) {
      
      const response = await fetch(serverURL + "/v1/saveImage", {
        method: "POST",
        mode: "cors",
        body: JSON.stringify((images[0] as Image)?.data_url),
      });

      if (response) {
        const responseF = await response.json();
        urlAvatar = responseF.url;
        urlAvatarTmb = responseF.thumbnailUrl;
      }
    }

    let payload = {
      email: data.email,
      password: data.password,
      username: data.username,
      name: data.name,
      avatar: urlAvatar,
      cover: urlCover,
      avatar_thumbnail: urlAvatarTmb,
      phone: data.phone ?? undefined,
      resume: data.resume,
    };

    updateUser({
      variables: payload,
    });
  });

 

  useEffect(() => {
    if (user) {
      setValue("email", user?.me?.email);
      setValue("username", user?.me?.username);
      setValue("name", user?.me?.name);
      setValue("resume", user?.me?.resume);
      setAvatar(user?.me?.avatar);
      setAvatarTmb(user?.me?.avatar_thumbnail);
      setCover(user?.me?.cover);
      setValue("phone", user?.me?.phone);
      setNewTypeUser(user?.me?.type?.name);
    }
  }, [user]);

  const updateUserType = () => {
    const payload = {
      type: newTypeUser,
    };

    updateUser({
      variables: payload,
    }).catch((e) => console.log(e));

    refetch();
  };

  return (
    <div>
      <PageName
        name={t("user_settings")}
        breadcrumbs={[
          { name: t("dashboard"), href: isSuperAdmin ? "/admin" : "/home" },
          { name: t("setting"), href: "#" },
        ]}
      />
      <div className="block ">
        <div className=" flex flex-wrap  ">
          <div className="border-b flex flex-col border-gray-200">
            <nav
              className=" text-center    flex mx-auto space-x-8"
              aria-label="Tabs"
            >
              {tabs.map((tab, index) => (
                <button
                  key={tab.name}
                  onClick={(e) => {
                    let tabs2 = [...tabs];
                    tabs2.map((tab) => (tab.current = false));
                    tabs2[index].current = true;

                    setTabs(tabs2);
                  }}
                  className={classNames(
                    tab.current
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                    "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                  )}
                  aria-current={tab.current ? "page" : undefined}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
      {tabs.map((tab) => {
        if (tab.current) {
          if (tab.key === "general") {
            return (
              <div key={tab.name}>
                {mode === "view" ? (
                  <div>
                    <div className="pb-16 max-w-2xl">
                      <div className="px-4 sm:px-6 md:px-0">
                        <div className="py-2 mt-3">
                          <div className="mt-1 divide-y divide-gray-200">
                            <div className="space-y-1 flex justify-between">
                              <div className="flex flex-col">
                                <h3 className="text-lg font-medium leading-6 text">
                                  {t("profile")}
                                </h3>
                                <p className="max-w-2xl text-sm text-gray-500">
                                  {t("profile_info_1")}
                                  <br />
                                  {t("profile_info_2")}
                                </p>
                              </div>
                              <button
                                onClick={() => {
                                  setMode("edit");
                                }}
                                type="button"
                                className="rounded-md bg-main font-medium text-purple-600 hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                              >
                                {t("update")}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : mode === "edit" ? (
                  <div className="  mb-10 flex max-w-2xl flex-col md:px-8 xl:px-0">
                    <div className="   mt-3 mb-3">
                      <div className="flex items-start justify-start">
                        <div className="  flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md flex space-x-3 my-2  main-color hover:text-gray-500   focus:outline-none  "
                            onClick={() => setMode("view")}
                          >
                            <span className="sr-only">Close panel</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="icon"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                              />
                            </svg>
                            <span className="title">
                              {" "}
                              {t("return_to_setting")}{" "}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <form className="space-y-3  p-3">
                      <div>
                        <label
                          htmlFor="email"
                          className="text"
                        >
                          {t("email")}
                        </label>
                        <div className="mt-1  ">
                          <input
                            id="email"
                            disabled={true}
                            {...register("email")}
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="input-text"
                          />
                          {errors?.email && <p>{errors.email.message}</p>}
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="password"
                          className="text"
                        >
                          {t("new_password")}
                        </label>
                        <div className="mt-1 my-2">
                          <input
                            id="password"
                            type="password"
                            {...register("password")}
                            className="input-text"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="resume"
                          className="text"
                        >
                          {t("abaut")}
                        </label>
                        <div className="mt-1  ">
                          <textarea
                            id="resume"
                            {...register("resume")}
                            name="resume"
                            autoComplete="resume"
                            className="input-text"
                          />
                          {errors?.resume && <p>{errors.resume.message}</p>}
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="phone"
                          className="text"
                        >
                          {t("phone")}
                        </label>
                        <div className="mt-1  ">
                          <input
                            id="phone"
                            {...register("phone")}
                            name="phone"
                            type="phone"
                            autoComplete="phone"
                            className="input-text"
                          />
                          {errors?.phone && <p>{errors.phone.message}</p>}
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="name"
                          className="text"
                        >
                          {t("name")}
                        </label>
                        <div className="mt-1  ">
                          <input
                            id="name"
                            {...register("name")}
                            name="name"
                            type="name"
                            autoComplete="name"
                            required
                            className="input-text"
                          />
                          {errors?.name && <p>{errors.name.message}</p>}
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="username"
                          className="text"
                        >
                          {t("username")}
                        </label>
                        <div className="mt-1  ">
                          <input
                            id="username"
                            {...register("username")}
                            name="username"
                            type="username"
                            autoComplete="username"
                            required
                            className="input-text"
                          />
                          {errors?.username && <p>{errors.username.message}</p>}
                        </div>
                      </div>


                      <div>
                        <label
                          htmlFor="avatar"
                          className="text"
                        >
                          {t("avatar")}
                        </label>
                        <div className="mt-1 flex space-x-2 ">
                          <ImageUploading
                            value={images}
                            onChange={onChangeAvatar}
                            maxNumber={maxNumber}
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
                                          <UserCircleIcon
                                            className="h-12 w-12 text-gray-300"
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
                                          <div
                                            key={index}
                                            className="image-item"
                                          >
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
                        </div>
                      </div>
                      <ImageUploading
                        value={imagesCover}
                        onChange={onChangeCover}
                        maxNumber={maxNumber}
                        dataURLKey="data_url"
                      >
                        {({
                          imageList: imageListCover,
                          onImageUpload: uploadCover,
                          onImageRemoveAll: onImageRemoveAllCover,
                          onImageUpdate,
                          onImageRemove,
                          isDragging,
                          dragProps,
                        }) => (
                          <div className="col-span-full">
                            <label
                              htmlFor="cover-photo"
                              className="block text-sm font-medium leading-6 text"
                            >
                              {t("cover")}
                            </label>

                            {!imageListCover[0] ? (
                              <div
                                onClick={onImageRemoveAllCover}
                                className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
                              >
                                <div
                                  onClick={(e) => {
                                    e.preventDefault();
                                    uploadCover();
                                  }}
                                  {...dragProps}
                                  className="text-center"
                                >
                                  <PhotoIcon
                                    className="mx-auto h-12 w-12 text"
                                    aria-hidden="true"
                                  />
                                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                    <label
                                      htmlFor="file-upload"
                                      className="relative cursor-pointer rounded-md bg-main font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                    >
                                      <span>{t("upload_file")}</span>
                                      <input
                                        id="file-upload"
                                        name="file-upload"
                                        type="file"
                                        className="sr-only"
                                      />
                                    </label>
                                  </div>
                                  <p className="text-xs leading-5 text-gray-600">
                                    PNG, JPG, GIF up to 10MB
                                  </p>
                                </div>
                              </div>
                            ) : (
                              imageListCover.map(
                                (image: any, index: number) => (
                                  <div
                                    onClick={onImageRemoveAllCover}
                                    key={index}
                                    className="image-item"
                                  >
                                    <img
                                      src={image["data_url"] ?? ""}
                                      className="w-full h-48 object-cover"
                                    />
                                  </div>
                                )
                              )
                            )}
                          </div>
                        )}
                      </ImageUploading>

                      <div className="mt-3 flex pb-10 space-x-3">
                        {avatarProgress === 1 || coverProgress === 1 ? (
                          <button className="btn-update">Actualizar</button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              onSubmitUpdate();
                            }}
                            className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            {loading && <Loading />}
                            Actualizar
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setMode("view");
                          }}
                          className="flex w-full justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="  mb-10 flex max-w-2xl flex-col md:px-8 xl:px-0">
                    <div className="   mt-3 mb-3">
                      <div className="flex items-start justify-start">
                        <div className="  flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md flex space-x-3 my-2 bg-white main-color hover:text-gray-500 focus:outline-none focus:outline-none  "
                            onClick={() => setMode("view")}
                          >
                            <span className="sr-only">Close panel</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="icon"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                              />
                            </svg>
                            <span className="title">
                              {" "}
                              {t("return_to_setting")}{" "}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>{" "}
                    <div className="flex p-3">
                      <button
                        onClick={() => {
                          updateUserType();
                          // setMode("view");
                        }}
                        type="button"
                        className="btn-main w-32"
                      >
                        {t("update")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          }
          if (tab.key === "language") {
            return (
              <div key={tab.name}>
                <div>
                  <div className="pb-16 max-w-2xl">
                    <div className="px-4 sm:px-6 md:px-0">
                      <LanguagesSetting />
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          if (tab.key === "notifications") {
            return (
              <div key={tab.name}>
                <div>
                  <div className="pb-16 max-w-2xl">
                    <div className="px-4 sm:px-6 md:px-0">
                      <NotificationsSetting />
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        }
      })}
    </div>
  );
};

export default SettingProfilePage;
