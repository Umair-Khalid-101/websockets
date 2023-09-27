import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

// CONTEXT
import { useStateContext } from "../context";

// CONSTANTS
import { apiUrl } from "../constants";

const SignUp = () => {
  const navigate = useNavigate();
  const { setUser } = useStateContext();
  const [file, setFile] = useState();
  const [picture, setPicture] = useState();
  const [loading, setLoading] = useState(false);
  const [pic, setPic] = useState();

  const { handleSubmit, control } = useForm();

  const onSubmit = async (formdata) => {
    setLoading(true);
    // console.log("Data (22): ", formdata);
    if (
      !formdata.name ||
      !formdata.email ||
      !formdata.password ||
      !formdata.confirmpassword
    ) {
      toast.error("Please fill all the fields", {
        position: "top-right",
      });
      setLoading(false);
      return;
    }

    if (formdata.password !== formdata.confirmpassword) {
      toast.error("Passwords do not match", {
        position: "top-right",
      });
      setLoading(false);
      return;
    }

    if (pic) {
      formdata.pic = pic;
    }

    try {
      // console.log("Data (44): ", formdata);
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${apiUrl}/api/user/signup`,
        formdata,
        config
      );
      toast.success("SignUp Successfull!", {
        position: "top-right",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));

      setLoading(false);
      navigate("/chats");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }

    // setUser(data);
    // navigate("/chats");
  };

  function handleChange(e) {
    // console.log(e.target.files);
    setFile(URL.createObjectURL(e.target.files[0]));
    handleUpload(e.target.files[0]);
  }

  // HANDLE IMAGE UPLOADS
  const handleUpload = (picture) => {
    setLoading(true);
    if (picture === undefined) {
      toast.error("Please Select a picture!", {
        position: "top-right",
      });
      setLoading(false);
      return;
    }

    if (picture.type === "image/jpeg" || picture.type === "image/png") {
      const data = new FormData();
      data.append("file", picture);
      data.append("upload_preset", "ChatApp");
      data.append("cloud_name", "dfmhxmauj");

      axios
        .post("https://api.cloudinary.com/v1_1/dfmhxmauj/image/upload", data)
        .then((response) => {
          setPic(response.data.url.toString());
          // console.log("Pic: ", response.data.url.toString());
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    } else {
      toast.error("Please Select a picture!", {
        position: "top-right",
      });
      setLoading(false);
      return;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign Up
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <input
                    id="name"
                    {...field}
                    type="text"
                    autoComplete="name"
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Your Full Name"
                  />
                )}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <input
                    id="email"
                    {...field}
                    type="email"
                    autoComplete="email"
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Your Email Address"
                  />
                )}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <input
                    id="password"
                    {...field}
                    type="password"
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Your Password"
                  />
                )}
              />
            </div>

            <div>
              <label htmlFor="confirmpassword" className="sr-only">
                Password
              </label>
              <Controller
                name="confirmpassword"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <input
                    id="confirmpassword"
                    {...field}
                    type="password"
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Confirm Your Password"
                  />
                )}
              />
            </div>

            <div>
              <label htmlFor="profilepic" className="sr-only">
                Profile Pic
              </label>
              <input
                className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                type="file"
                id="formFile"
                onChange={handleChange}
              />
            </div>

            {file && (
              <div
                className="ml-3 h-16 flex 
              items-center
              "
              >
                <img
                  src={file}
                  alt="profile pic"
                  className="w-12 h-12 rounded-[50%]"
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-start">
            <section
              className="flex gap-2 text-indigo-600 cursor-pointer
            hover:text-indigo-800 duration-300
            "
            >
              Already have an account?
              <p
                className="hover:font-semibold duration-500"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Sign In
              </p>
            </section>
          </div>

          <div>
            {!loading && (
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign Up
              </button>
            )}

            {loading && (
              <button
                disabled={true}
                type="submit"
                className="flex w-full justify-center items-center gap-2 rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer"
              >
                <svg
                  aria-hidden="true"
                  role="status"
                  className="inline mr-3 w-4 h-4 text-white animate-spin"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                  ></path>
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
