/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  TextInput,
  Select,
  SelectItem,
} from "@tremor/react";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { LifebuoyIcon } from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import {  useMutation, useQuery } from "@apollo/client";
import { toast } from "sonner";
import SupportTicketsPage from "./SupportTicketsPage";
import {
  CREATE_SUPPORT_TICKET,
  GET_ALL_TICKETS,
  GET_USER_SUPPORT_TICKETS,
} from "./supportGraphql";
import { SupportTicketContentInput } from "./supportTypes";
import PageName from "@/components/ui/commons/PageName";
import PageLoader from "@/components/ui/loaders/PageLoader";
import TextArea from "@/components/core/TextArea";
import useSuperAdmin from "@/utils/hooks/useSuperAdmin";

const AdminSupportHomePage = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const { handleSubmit, setValue, reset } = useForm();
  //Get params "newTicket" from params from url
  // useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const newTicket = urlParams.get("newTicket");

  //   if (newTicket) {
  //     if (newTicket === "NewCategory") {
  //       setValue("subject", "Nova categoria");
  //       setValue("departament", "SUPPORT");
  //       setValue(
  //         "message",
  //         "Eu gostaria de criar uma nova categoria com o nome:"
  //       );
  //     }
  //     if (newTicket === "NewActivity") {
  //       setValue("subject", "Nova atividade");

  //       setValue("departament", "SUPPORT");
  //       setValue(
  //         "message",
  //         "Eu gostaria de criar uma nova atividade com o nome:"
  //       );
  //     }

  //     setIsNewTicketOpen(true);
  //   }
  // }, []);

  const [tabSelected, setTabSelected] = useState(0);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);

  const { data: userTickets, refetch } = useQuery(GET_USER_SUPPORT_TICKETS);
  const { data: adminTickets } = useQuery(GET_ALL_TICKETS);
  const { isSuperAdmin } = useSuperAdmin();

  useEffect(() => {
    if (isSuperAdmin) {
      
      adminTickets?.getSupportTickets &&
        setTickets(adminTickets?.getSupportTickets);
    } else {
      userTickets?.getSupportTicketsForUser &&
        setTickets(userTickets?.getSupportTicketsForUser);
    }
  }, [adminTickets, userTickets, isSuperAdmin]);

  const [sendNewTicket, { loading: loadingSendNewTicket }] = useMutation(
    CREATE_SUPPORT_TICKET
  );

  const handleClickTab = (index: number) => {
    setTabSelected(index);
  };
  const handleOpenNewTicketSidebar = () => {
    setIsNewTicketOpen(!isNewTicketOpen);
  };

  const isFormDataValid = (data: any) => {
    if (!data.subject) {
      toast.error("Subject is required");
      return false;
    }
    if (!data.message) {
      toast.error("Message is required");
      return false;
    }
    if (!data.departament) {
      toast.error("Departament is required");
      return false;
    }
    return true;
  };
  const handleSendNewTicket = (data: any) => {
    //Validate inputs
    if (!isFormDataValid(data)) return;

    const content: SupportTicketContentInput[] = [
      {
        content: JSON.stringify(data.message.replace(/\n/g, "<br>")),
        type: "TEXT",
      },
    ];

    const payload = {
      subject: data.subject,
      departament: data.departament,
      contents: content,
    };

    sendNewTicket({
      variables: payload,
    })
      .then(() => {
        reset();
        refetch();
        handleOpenNewTicketSidebar();
        toast.success("Ticket created successfully");
      })
      .catch((e) => toast.error(e.message));
  };
  return (
    <div>
      <PageName
        name={"Support"}
        breadcrumbs={[
          { name: "Dashboard", href: "/home" },
          { name: "Support", href: "#" },
        ]}
        btn1={{
          fn: handleOpenNewTicketSidebar,
          name: "New Ticket",
        }}
      />{" "}
      <Card>
        <TabGroup onIndexChange={handleClickTab} defaultIndex={tabSelected}>
          <TabList>
            <Tab
              className={`${tabSelected === 0 && "text-primary"}`}
              color="default"
              icon={LifebuoyIcon}
            >
              Tickets
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <div className="mt-10">
                <SupportTicketsPage tickets={tickets} />
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </Card>
      <Transition.Root show={isNewTicketOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40" onClose={setIsNewTicketOpen}>
          <div className="fixed inset-0" />
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <form
                      onSubmit={handleSubmit(handleSendNewTicket)}
                      className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl"
                    >
                      <div className="h-0 flex-1 overflow-y-auto">
                        <div className="g-main  px-4 py-6 sm:px-6">
                          <div className="flex items-center justify-between">
                            <Dialog.Title className="text-title">
                              New Ticket
                            </Dialog.Title>
                            <div className="ml-3 flex h-7 items-center">
                              <button
                                type="button"
                                className="relative rounded-md g-main  "
                                onClick={() => setIsNewTicketOpen(false)}
                              >
                                <span className="absolute -inset-2.5" />
                                <span className="sr-only">Close panel</span>
                                <XMarkIcon
                                  className="h-6 w-6"
                                  aria-hidden="true"
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div className="divide-y divide-gray-200 px-4 sm:px-6">
                            <div className="space-y-6 pb-5 pt-6">
                              <div>
                                <label
                                  htmlFor="subject"
                                  className="block text-sm font-medium leading-6 text"
                                >
                                  New Ticket
                                </label>
                                <div className="mt-2">
                                  <TextInput
                                    onValueChange={(c: any) =>
                                      setValue("subject", c)
                                    }
                                  />
                                </div>
                              </div>
                              <div>
                                <label
                                  htmlFor="description"
                                  className="block text-sm font-medium leading-6 text"
                                >
                                  Description
                                </label>
                                <div className="my-2">
                                  <TextArea
                                    contentText={null}
                                    rows={3}
                                    onBlur={null}
                                    onFocus={null}
                                    onChange={(c: any) =>
                                      setValue("message", c)
                                    }
                                  />
                                </div>
                              </div>
                              <div>
                                <label
                                  htmlFor="departament"
                                  className="block mt-14 text-sm font-medium leading-6 text"
                                >
                                  Departament
                                </label>
                                <div className="mt-2">
                                  <Select
                                    onValueChange={(value: string) =>
                                      setValue("departament", value)
                                    }
                                  >
                                    <SelectItem value="BILLING">
                                      Billing
                                    </SelectItem>
                                    <SelectItem value="SALES">
                                      Sales{" "}
                                    </SelectItem>
                                    <SelectItem value="SUPPORT">
                                      Support
                                    </SelectItem>
                                  </Select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-shrink-0 justify-end px-4 py-4">
                        <button
                          type="button"
                          className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                          onClick={() => setIsNewTicketOpen(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          Send
                          {loadingSendNewTicket && <PageLoader />}
                        </button>
                      </div>
                    </form>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default AdminSupportHomePage;
