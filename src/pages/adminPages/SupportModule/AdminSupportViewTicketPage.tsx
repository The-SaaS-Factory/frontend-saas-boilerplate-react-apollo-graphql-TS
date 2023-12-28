/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from "@apollo/client";
import { useParams } from "react-router";

import { Card, Flex } from "@tremor/react";
import { showTicketStatus } from "./SupportTicketsPage";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  ADD_MESSAGE_TO_SUPPORT_TICKET,
  CLOSE_SUPPORT_TICKET,
  GET_SUPPORT_TICKET,
} from "./supportGraphql";
import { SupportTicketContentInput } from "./supportTypes";
import PageLoader from "@/components/ui/loaders/PageLoader";
import PageName from "@/components/ui/commons/PageName";
import { formatTimestampToDateString } from "@/utils/facades/strFacade";
import UserCard from "@/components/ui/commons/UserCard";
import TextArea from "@/components/core/TextArea";
import useSuperAdmin from "@/utils/hooks/useSuperAdmin";
import { GET_CURRENT_USER } from "@/utils/graphql/graphqlGlobalQueries";
import { XMarkIcon } from "@heroicons/react/24/outline";

const AdminSupportViewTicketPage = () => {
  const { ticketId } = useParams();
  const { handleSubmit, setValue, watch, reset } = useForm();
  const [sendNewMessage, { loading: loadingSaveNewMessage }] = useMutation(
    ADD_MESSAGE_TO_SUPPORT_TICKET
  );
  const [closeSupportTicket] = useMutation(CLOSE_SUPPORT_TICKET);
  const { data: userBD } = useQuery(GET_CURRENT_USER);

  const { isSuperAdmin } = useSuperAdmin();

  const { data, loading, error, refetch } = useQuery(GET_SUPPORT_TICKET, {
    variables: {
      ticketId: parseInt(ticketId as string),
    },
  });

  const ticket = data?.getSupportTicket;

  const handleCloseTicket = () => {
    const promise = () =>
      new Promise((resolve, reject) =>
        closeSupportTicket({
          variables: {
            ticketId: parseInt(ticket.id),
          },
        })
          .then(() => {
            resolve("Success");
          })
          .catch((e) => {
            console.log(e);
            toast.error(e.message);
            reject(e.message);
          })
      );

    toast.promise(promise, {
      loading: "Loading...",
      success: () => {
        refetch();
        return "Ticket closed successfully";
      },
      error: (error) => {
        return error;
      },
    });
  };

  const handleNewMessage = (data: any) => {
    const content: SupportTicketContentInput[] = [
      {
        content: JSON.stringify(data.message.replace(/\n/g, "<br>")),
        type: "TEXT",
      },
    ];

    //Validate
    if (
      (content && content[0]?.content === "") ||
      content[0]?.content === '"<p><br></p>"'
    ) {
      toast.error("Message cannot be empty");
      return;
    }

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
        toast.success("Message sent successfully");
      })
      .catch((e) => toast.error(e.message));
  };

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return <span>Error {error.message}</span>;
  }

  return (
    <div>
      <PageName
        name={`Ticket ${ticket?.id}`}
        btn1={
          ticket.status !== "CLOSED"
            ? {
                name: "Close ticket",
                href: "#",
                fn: handleCloseTicket,
                icon: XMarkIcon,
              }
            : undefined
        }
        breadcrumbs={[
          { name: "Dashboard", href: isSuperAdmin ? "/admin" : "/home" },
          {
            name: "Support",
            href: isSuperAdmin ? "/admin/support/tickets" : "/home/support",
          },
          { name: `Ticket ${ticket?.id}`, href: "#" },
        ]}
      />
      <div>
        <Card className="mr-3">
          <div className="flex flex-col justify-between space-y-3 lg:space-y-0 lg:flex-row">
            <span className="subtitle">Subject: {ticket?.subject}</span>
            <span className="subtitle">
              Status: {showTicketStatus(ticket?.status)}
            </span>
            <span className="subtitle">
              Date: {formatTimestampToDateString(ticket?.createdAt)}
            </span>
          </div>
          <div className="mt-3">
            {ticket?.SupportTicketMessage.map((message: any) => {
              return message.SupportTicketMessageContent.filter(
                (content: any) =>
                  content.type === "TEXT" && content.content !== ""
              ).map((text: any, index: number) => {
                return (
                  <Card
                    key={`content${index}`}
                    className={`my-3 ${
                      message.userId == userBD?.me?.id
                        ? "bg-gray-50"
                        : "bg-white"
                    }`}
                  >
                    <Flex>
                      <UserCard user={message.user} />{" "}
                      <span>
                        {formatTimestampToDateString(message.createdAt, true)}
                      </span>
                    </Flex>
                    <hr className="my-3" />
                    <Flex>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: JSON.parse(text.content ?? ""),
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
                  Add response
                </label>

                <div className="mt-2 my-14">
                  <TextArea
                    contentText={watch("message")}
                    rows={3}
                    onBlur={null}
                    onFocus={null}
                    onChange={(c: any) => setValue("message", c)}
                  />
                </div>
              </div>
              <div className="flex">
                <button className="btn-main   ml-auto flex">
                  {loadingSaveNewMessage ? (
                    <div className="mr-2">
                      <PageLoader />
                    </div>
                  ) : (
                    <span>Send message</span>
                  )}
                </button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminSupportViewTicketPage;
