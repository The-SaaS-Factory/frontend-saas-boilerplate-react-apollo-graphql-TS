import { useMutation, useQuery } from "@apollo/client";
import { useParams } from "react-router";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  ADD_MESSAGE_TO_SUPPORT_TICKET,
  GET_SUPPORT_TICKET,
} from "../../../../../utils/queries";
import { SupportTicketContentInput } from "../../../../../types/Types";
import Loading from "../../../../../components/commons/Loading";
import PageName from "../../../../../components/commons/PageName";
import { Card, Flex } from "@tremor/react";
import { showTicketStatus } from "./SuperAdminSupportTicketsListPage";
import { formatTimestampToDateString } from "../../../../../utils/facades/strFacade";
import TextArea from "../../../../../components/commons/TextArea";
import UserCard from "../../../../../components/commons/UserCard";
import { useTranslation } from "react-i18next";

const SuperAdminSupportTicketViewPage = () => {
  const { ticketId } = useParams();
  const { t } = useTranslation("superadmin");
  const { handleSubmit, register, setValue, watch, reset } = useForm();
  const [sendNewMessage, { loading: loadingSendNewTicket }] = useMutation(
    ADD_MESSAGE_TO_SUPPORT_TICKET
  );
  const { user } = useSelector((state: any) => state.auth);
  const { data, loading, error, refetch } = useQuery(GET_SUPPORT_TICKET, {
    variables: {
      ticketId: parseInt(ticketId as string),
    },
  });

  const ticket = data?.getSupportTicket;


  const handleNewMessage = (data: any) => {
    const content: SupportTicketContentInput[] = [
      {
        content: JSON.stringify(data.message.replace(/\n/g, "<br>")),
        type: "TEXT",
      },
    ];

    const payload = {
      ticketId: parseInt(ticket.id),
      contents: content,
    };

    sendNewMessage({
      variables: payload,
    })
      .then(() => {
        refetch();
        reset();
        toast.success(t("message_sended"));
      })
      .catch((e) => toast.error(e.message));
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <span>Error {error.message}</span>;
  }

  return (
    <div>
      {" "}
      <PageName
        name={`Ticket ${ticket.id}`}
        breadcrumbs={[
          { name: t("dashbaord"), href: "/home" },
          { name: t("support"), href: "/home/support" },
          { name: `${t("ticket")} ${ticket.id}`, href: "#" },
        ]}
      />{" "}
      <div>
        <Card className="mr-3">
          <div className="flex flex-col justify-between space-y-3 lg:space-y-0 lg:flex-row">
            <span className="subtitle">{t("subject")}: {ticket.subject}</span>
            <span className="subtitle">
            {t("status")}: {showTicketStatus(ticket.status)}
            </span>
            <span className="subtitle">
            {t("date")}: {formatTimestampToDateString(ticket.createdAt)}
            </span>
          </div>
          <div className="mt-3">
            {ticket.SupportTicketMessage.map((message: any) => {
              return message.SupportTicketMessageContent.filter(
                (content) => content.type === "TEXT"
              ).map((text, index) => {
                return (
                  <Card
                    key={`content${index}`}
                    className={`my-3 ${
                      message.userId == user.id ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <Flex>
                      <UserCard user={message.user} />{" "}
                      <span>
                        {formatTimestampToDateString(message.createdAt)}
                      </span>
                    </Flex>
                    <hr className="my-3" />
                    <Flex>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: JSON.parse(text.content),
                        }}
                      ></div>
                    </Flex>
                  </Card>
                );
              });
            })}
          </div>
        </Card>
        {(ticket.status == "AWAITING_RESPONSE" ||
          ticket.status == "UNDER_REVIEW" ||
          ticket.status == "OPEN") && (
          <Card className="mt-7 flex flex-col">
            <form onSubmit={handleSubmit(handleNewMessage)}>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium leading-6 text"
                >
                 {t("add_response")}   
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
                <div className="flex">
                  <button className="btn-main mt-3 ml-auto">
                   {t("send_message")}    
                  </button>
                </div>
              </div>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SuperAdminSupportTicketViewPage;
