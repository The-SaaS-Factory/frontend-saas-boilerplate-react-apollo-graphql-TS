/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "sonner";
import { Card, Flex, Select, SelectItem, TextInput } from "@tremor/react";
import {
  ArchiveBoxArrowDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  CREATE_CAPABILITIE,
  DELETE_CAPABILITIE,
  GET_CAPABILITIES,
} from "./plansGraphql";
import PageLoader from "@/components/ui/loaders/PageLoader";
import ReactQuill from "react-quill";

const modules = {
  toolbar: [["bold", "italic", "underline"]],
};
const formats = ["header", "bold", "italic", "underline", "indent"];

const SuperAdminPlansCapabilities = () => {
  //States
  //Funtions and hooks
  const { handleSubmit, reset, setValue } = useForm();
  const {
    data: capabilities,
    refetch,
    loading: loadingCapabilities,
  } = useQuery(GET_CAPABILITIES);
  const [saveCapabilitie, { loading }] = useMutation(CREATE_CAPABILITIE, {
    onCompleted: () => {
      toast.success("Capabilitie created successfully");
      reset();
      refetch();
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const [deleteCapabilitie] = useMutation(DELETE_CAPABILITIE, {
    onCompleted: () => {
      toast.success("Capabilitie deleted successfully");
      refetch();
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const storeNewCapabilitie = (data: any) => {
    const payload = {
      name: data.name,
      type: data.type,
      group: data.group,
      description: data.description,
    };

    saveCapabilitie({ variables: payload });
  };

  const handleDeleteCapabilitie = (capabilitieId: string) => {
    const id = parseInt(capabilitieId);
    deleteCapabilitie({ variables: { capabilitieId: id } });
  };

  if (loading || loadingCapabilities) {
    return <PageLoader />;
  }

  return (
    <>
      <div className="grid lg:gap-7 lg:grid-cols-2 ">
        <div>
          {capabilities?.getAllCapabilities.map((capabilitie: any) => (
            <Card className="my-3" key={`${capabilitie.id}`}>
              <Flex>
                <span className="text">
                  {capabilitie.name} - {capabilitie.type}
                </span>
                <button
                  onClick={() => handleDeleteCapabilitie(capabilitie.id)}
                  className="btn-icon "
                >
                  <XMarkIcon className="h-5 w-5 " />
                </button>
              </Flex>
            </Card>
          ))}

          {capabilities?.getAllCapabilities.length === 0 && (
            <div className="flex flex-col items-center justify-center h-96">
              <ArchiveBoxArrowDownIcon className="h-20 w-20 text-gray-500" />
              <span className="text-gray-500 text-lg mt-5">
                No capabilities created
              </span>
            </div>
          )}
        </div>
        <div className="  ">
          <h2 className="text-subtitle py-3">New Capability</h2>
          <form
            className="space-y-3"
            onSubmit={handleSubmit(storeNewCapabilitie)}
          >
            <div className="flex flex-col space-y-1">
              <span className="text-content text text-sm">Name</span>
              <TextInput onValueChange={(value) => setValue("name", value)} />
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-content text text-sm">Type</span>

              <Select onValueChange={(value) => setValue("type", value)}>
                <SelectItem value="">-Select-</SelectItem>
                <SelectItem value="LIMIT">Limit</SelectItem>
                <SelectItem value="PERMISSION">Permission</SelectItem>
                <SelectItem value="AMOUNT">Amount</SelectItem>
              </Select>
            </div>
            {/* <div className="flex flex-col space-y-1">
              <span className="text-content text text-sm">Group</span>
              <Select onValueChange={(value) => setValue("group", value)}>
                <SelectItem value="">-Select-</SelectItem>
                <SelectItem value="MEMBERSHIP">Membership</SelectItem>
                <SelectItem value="ADS">Ads</SelectItem>
              </Select>
            </div> */}

            <div className="flex flex-col space-y-1 mt-3 mb-14">
              <span className="text-content text text-sm">Description</span>
              <ReactQuill
                theme="snow"
                onChange={(value) => setValue("description", value)}
                modules={modules}
                className="h-32"
                formats={formats}
              />
            </div>

            <div className="flex pt-14 flex-col   mx-auto w-1/3 space-y-1">
              <button type="submit" className="btn-main w-24 text-center">
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SuperAdminPlansCapabilities;
