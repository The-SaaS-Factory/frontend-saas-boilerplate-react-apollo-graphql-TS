import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LOGIN_USER } from "../../../utils/queries";
import { REGISTER_USER } from "../../../utils/queries";
import { useForm, Resolver } from "react-hook-form";
import { useDispatch } from "react-redux/es/exports";
import { login } from "../../../redux/authSlice";
import { toast } from "sonner";
import Loading from "../../../components/commons/Loading";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";

type FormValues = {
  email: string;
  password: string;
  name: string;
};

const resolver: Resolver<FormValues> = async (values) => {
  return {
    values: values.email ? values : {}, // if email is not empty, return values
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

const LoginPage = () => {
  //Change it
  const demo = true;
  const { t } = useTranslation("platform");

  const [typeSelected, setTypeSelected] = useState(1);
  const dispatch = useDispatch();
  const params = useParams();

  //Action
  const [action, setAction] = useState(params.page);

  const [registerUser, { error: ErrorRegister, loading: loadingRegister }] =
    useMutation(REGISTER_USER, {
      onCompleted(data, clientOptions) {
        window.localStorage.setItem("token", data.createUser.token);
        let payload = {
          id: data.createUser.user.id,
          username: data.createUser.user.username,
          email: data.createUser.user.email,
          avatar: data.createUser.user.avatar,
        };

        dispatch(
          login({
            token: data.createUser.token,
            user: payload,
          })
        );
        navigate("/home");
      },
      onError(error) {
        console.log(error);

        toast.error(t(error.message));
      },
    });

  const navigate = useNavigate();

  const [loginUser, { called, loading, error }] = useMutation(LOGIN_USER, {
    variables: { email: " ", password: " " },
    onCompleted: (data) => {
      console.log(data);

      window.localStorage.setItem("token", data.login.token);
      let isSuperAdmin = false;
      let payload = {
        username: data?.login?.user.username,
        email: data?.login?.user.email,
        avatar: data?.login?.user.avatar,
        plan: data?.login?.user.Membership[0]?.plan?.name,
        id: data?.login?.user.id,
        roles: [] as string[],
        permissions: [] as string[],
      };

      if (
        data?.login?.user.UserRole &&
        Array.isArray(data.login.user.UserRole)
      ) {
        data.login.user.UserRole.forEach((userRole) => {
          if (userRole.role && userRole.role.name) {
            if (
              userRole.role.name === "superadmin" ||
              userRole.role.name === "superAdmin"
            ) {
              isSuperAdmin = true;
            }
            payload.roles.push(userRole.role.name);
          }
        });
      }

      if (
        data?.login?.user.UserPermission &&
        Array.isArray(data.login.user.UserPermission)
      ) {
        data.login.user.UserPermission.forEach((UserPermission) => {
          if (UserPermission.role && UserPermission.role.name) {
            payload.roles.push(UserPermission.role.name);
          }
        });
      }

      dispatch(
        login({
          token: data.login?.token,
          user: payload,
          isSuperAdmin,
        })
      );

      isSuperAdmin ? navigate("/admin") : navigate("/home");
    },
    onError(error) {
      console.log(error);

      toast.error(error.message);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver });

  const onSubmitLogin = handleSubmit((data) => {
    loginUser({
      variables: { email: data.email, password: data.password },
    });
  });

  const sponsor = localStorage.getItem("aff");

  const onSubmitRegister = handleSubmit((dataRaw) => {
    let payload = {
      email: dataRaw.email,
      username: dataRaw.name,
      lang: localStorage.getItem("i18nextLng"),
      password: dataRaw.password,
      sponsor: sponsor ? parseInt(sponsor) : null,
    };

    registerUser({
      variables: payload,
    });
  });

  return (
    <>
      <Helmet>
        <title>{t("access_to_account")}</title>
      </Helmet>
      {action === "login" ? (
        <>
          <div className="sm:mx-auto sm:w-full sm:max-w-md  min-h-full    justify-center py-12   ">
            <div className="  ">
              <h2 className="mt-6 text-center mega-title">
                {t("access_to_account")}
              </h2>
              <div className="mt-2 flex space-x-1 justify-center  mx-auto text-center text-sm text-gray-600 px-2">
                <p>{t("o")} </p>

                <button
                  onClick={() => setAction("register")}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  {t("register_new_account")}
                </button>
              </div>
            </div>

            <div className="mt-8    ">
              <div className="bg-white py-8 px-4 shadow sm:rounded-lg  ">
                {demo && (
                  <div className="flex space-x-2 my-3">
                    <button
                      className="btn-main"
                      onClick={() => {
                        loginUser({
                          variables: {
                            email: "user@user.com",
                            password: "123456789",
                          },
                        });
                      }}
                    >
                      Login as Admin{" "}
                    </button>
                    <button
                      className="btn-main"
                      onClick={() => {
                        loginUser({
                          variables: {
                            email: "admin@admin.com",
                            password: "123456789",
                          },
                        });
                      }}
                    >
                      Login as SuperAdmin
                    </button>
                  </div>
                )}
                <form onSubmit={onSubmitLogin}>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
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

                  <div className="mt-2">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t("form_password")}
                    </label>
                    <div className="mt-">
                      <input
                        id="password"
                        type="password"
                        {...register("password")}
                        autoComplete="current-password"
                        required
                        className="input-text"
                      />
                    </div>

                    <div className="m-1">
                      <Link
                        to={"/auth/forgotpassword"}
                        className="text-sm text-blue-500"
                      >
                        {t("forgot_password")}
                      </Link>
                    </div>
                  </div>

                  <div className="mt-3">
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      {loading && <Loading />} {t("login_action")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div>
            <pre>
              {ErrorRegister?.clientErrors?.map(({ message }, i) => (
                <span key={i}>{message}</span>
              ))}
            </pre>
          </div>
          <div className=" sm:mx-auto sm:w-full sm:max-w-md    justify-center py-12   ">
            <div className="   sm:w-full  ">
              {/* <img
            className="mx-auto h-12 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          /> */}
              <h2 className="mt-6 text-center mega-title">
                {t("login_title")}
              </h2>
              <div className="mt-2 flex space-x-1 justify-center  mx-auto text-center text-sm text-gray-600 px-2">
                <p>{t("o")} </p>
                <button
                  onClick={() => setAction("login")}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  {loading && <Loading />} {t("login_action")}
                </button>
              </div>
            </div>

            <div className="mt-8  sm:w-full  ">
              <div className="bg-white py-8 px-4 shadow sm:rounded-lg  ">
                <form onSubmit={onSubmitRegister} className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t("form_name")}
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        {...register("name")}
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        className="input-text "
                      />
                    </div>
                  </div>{" "}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t("form_email")}
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        {...register("email")}
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="input-text"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t("form_password")}
                    </label>
                    <div className="mt-1">
                      <input
                        id="password"
                        type="password"
                        {...register("password")}
                        autoComplete="current-password"
                        required
                        className="input-text"
                      />
                    </div>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      {loadingRegister && <Loading />} {t("form_register")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default LoginPage;
