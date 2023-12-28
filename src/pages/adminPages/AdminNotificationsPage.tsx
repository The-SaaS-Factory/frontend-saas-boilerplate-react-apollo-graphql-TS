/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from "@apollo/client";

import {
  AtSymbolIcon,
  BellAlertIcon,
  ChatBubbleLeftEllipsisIcon,
  InboxIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useEffect } from "react";

import {
  GET_USER_NOTIFICATIONS,
  VIEWED_NOTIFICATIONS,
} from "@/utils/graphql/graphqlGlobalQueries";
import PageName from "@/components/ui/commons/PageName";

const AdminNotificationsPage = () => {
  const { data: notifications } = useQuery(GET_USER_NOTIFICATIONS);

  const [readAllNotifications] = useMutation(VIEWED_NOTIFICATIONS, {});

  useEffect(() => {
    readAllNotifications();
  }, []);

  return (
    <div>
      <div>
        <PageName
          name="Notifications"
          breadcrumbs={[
            {
              name: "Home",
              href: "/home",
            },
            {
              name: "Notifications",
              href: "/home/notifications",
            },
          ]}
        />
        {notifications?.getUserNotification?.length ? (
          <ul>
            {notifications.getUserNotification.map(
              (notification: any, index: number) => (
                <div key={index} className="flex my-1 items-start">
                  <div className="flex-shrink-0">
                    {notification.type === "ACCOUNT" && (
                      <InboxIcon
                        className="h-6 w-6 text-primary"
                        aria-hidden="true"
                      />
                    )}
                    {notification.type === "ALERT" && (
                      <BellAlertIcon
                        className="h-6 w-6 text-primary"
                        aria-hidden="true"
                      />
                    )}
                    {notification.type === "MENTION" && (
                      <AtSymbolIcon
                        className="h-6 w-6 text-primary"
                        aria-hidden="true"
                      />
                    )}
                    {notification.type === "FOLLOW" && (
                      <UserGroupIcon
                        className="h-6 w-6 text-primary"
                        aria-hidden="true"
                      />
                    )}
                    {notification.type === "MESSAGE" && (
                      <ChatBubbleLeftEllipsisIcon
                        className="h-6 w-6 text-primary"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-primary">
                      {notification.content}
                    </p>
                    <p className="mt-1 text-sm text-primary"></p>
                    <div className="mt-3 flex space-x-7"></div>
                  </div>
                  <div className="ml-4 flex flex-shrink-0"></div>
                </div>
              )
            )}
          </ul>
        ) : (
          <p className="text-primary">You have no unread notifications</p>
        )}
      </div>
    </div>
  );
};

export default AdminNotificationsPage;
