import PageName from "../../../components/commons/PageName";
import {
  Card,
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@tremor/react";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  InformationCircleIcon,
  LifebuoyIcon,
} from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import TextArea from "../../../components/commons/TextArea";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_SUPPORT_TICKET, GET_USER_SUPPORT_TICKETS } from '../../../utils/queries';
import { toast } from "sonner";
import Loading from "../../../components/commons/Loading";
import { SupportTicketContentInput } from "../../../types/Types";
import SupportTicketsPage from "./SupportTicketsPage";
import SupportKnowledgePage from "./SupportKnowledgePage";
import { useTranslation } from "react-i18next";
import useCheckMembership from "../../../hooks/useCheckMembership";

const SupportHomePage = () => {
  useCheckMembership();
  const [tabSelected, setTabSelected] = useState(0);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const { handleSubmit, register, setValue, watch, reset } = useForm();
  const { data: tickets, refetch } = useQuery(GET_USER_SUPPORT_TICKETS);
  const { t } = useTranslation("admin");

  const [sendNewTicket, { loading: loadingSendNewTicket }] = useMutation(
    CREATE_SUPPORT_TICKET
  );

  const handleClickTab = (index: number) => {
    setTabSelected(index);
  };
  const handleOpenNewTicketSidebar = () => {
    setIsNewTicketOpen(!isNewTicketOpen);
  };
  const handleSendNewTicket = (data: any) => {

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
        toast.success(t('ticket_created'));
      })
      .catch((e) => toast.error(e.message));
  };
  return (
    <div>
      <PageName
        name={t('dashboard')}
        breadcrumbs={[
          { name: t('dashboard'), href: "/home" },
          { name: t('support'), href: "#" },
        ]}
        btn1={{
          fn: handleOpenNewTicketSidebar,
          name: t('new_ticket'),
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
              {t('tickets')}
            </Tab>
            <Tab
              className={`${tabSelected === 1 && "text-primary"}`}
              icon={InformationCircleIcon}
            >
              {t('knowledge_base')}
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <div className="mt-10">
                <SupportTicketsPage tickets={tickets} />
              </div>
            </TabPanel>
            <TabPanel>
              <div className="mt-10">
                <SupportKnowledgePage />
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
                            <Dialog.Title className="text-base font-semibold leading-6 text-gray-700">
                            {t('new_ticket')} 
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
                                    {t('new_ticket')}   
                                </label>
                                <div className="mt-2">
                                  <input
                                    {...register("subject", {
                                      required: true,
                                    })}
                                    type="text"
                                    name="subject"
                                    id="subject"
                                    className="input-text"
                                  />
                                </div>
                              </div>
                              <div>
                                <label
                                  htmlFor="description"
                                  className="block text-sm font-medium leading-6 text"
                                >
                               
                               {t('description')}      
                                </label>
                                <div className="mt-2">
                                  <TextArea
                                    contentText={watch("message")}
                                    rows={3}
                                    onBlur={null}
                                    onFocus={null}
                                    onChange={(c) => setValue("message", c)}
                                  />
                                </div>
                              </div>
                              <div>
                                <label
                                  htmlFor="departament"
                                  className="block text-sm font-medium leading-6 text"
                                >
                                  {t('departament')}         
                                </label>
                                <div className="mt-2">
                                  <select
                                    {...register("departament", {
                                      required: true,
                                    })}
                                    className="input-text"
                                  >
                                    <option value="BILLING"> {t('billing')}     </option>
                                    <option value="SALES">{t('sales')} </option>
                                    <option value="SUPPORT">{t('support')}</option>
                                  </select>
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
                         {t('cancel')}
                        </button>
                        <button
                          type="submit"
                          className="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                           {t('send')}
                          {loadingSendNewTicket && <Loading />}
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

export default SupportHomePage;
