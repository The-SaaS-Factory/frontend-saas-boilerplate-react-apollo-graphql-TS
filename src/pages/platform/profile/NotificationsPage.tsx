import { useMutation, useQuery, useSubscription } from "@apollo/client";
import {
  GET_USER_NOTIFICATIONS,
  NEW_NOTIFICATION,
  VIEWED_NOTIFICATIONS,
} from "../../../utils/queries";
import {
  AtSymbolIcon,
  BellAlertIcon,
  ChatBubbleLeftEllipsisIcon,
  InboxIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useTranslation } from "react-i18next";
import { updateNotificationUnReaded } from "../../../redux/authSlice";
import PageName from "../../../components/commons/PageName";

const NotificationsPage = () => {
  const { user } = useSelector((state: any) => state.auth);
  const { t } = useTranslation("superadmin");
  const { data: notifications, refetch } = useQuery(GET_USER_NOTIFICATIONS);
  const dispatch = useDispatch();

  const [readAllNotifications, { data }] = useMutation(VIEWED_NOTIFICATIONS, {
    onCompleted(data, clientOptions) {
      dispatch(
        updateNotificationUnReaded({
          notificationsUnReaded: 0,
        })
      );
    },
  });

  useEffect(() => {
    readAllNotifications();
  }, []);

  const { data: suscription } = useSubscription(NEW_NOTIFICATION, {
    variables: {
      userId: parseInt(user.id),
    },
    onData: (data: any) => {
      refetch();
    },
  });
  return (
    <div>
      <div>
        <PageName name={t('notifications')} breadcrumbs={[]} />
        {notifications?.getUserNotification?.length ? (
          <ul>
            {notifications.getUserNotification.map(
              (notification: any, index) => (
                <div key={index} className="flex my-1 items-start">
                  <div className="flex-shrink-0">
                    {notification.type === "ACCOUNT" && (
                      <InboxIcon
                        className="h-6 w-6 text-gray-400"
                        aria-hidden="true"
                      />
                    )}
                    {notification.type === "ALERT" && (
                      <BellAlertIcon
                        className="h-6 w-6 text-gray-400"
                        aria-hidden="true"
                      />
                    )}
                    {notification.type === "MENTION" && (
                      <AtSymbolIcon
                        className="h-6 w-6 text-gray-400"
                        aria-hidden="true"
                      />
                    )}
                    {notification.type === "FOLLOW" && (
                      <UserGroupIcon
                        className="h-6 w-6 text-gray-400"
                        aria-hidden="true"
                      />
                    )}
                    {notification.type === "MESSAGE" && (
                      <ChatBubbleLeftEllipsisIcon
                        className="h-6 w-6 text-gray-400"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text">
                      {notification.content}
                    </p>
                    <p className="mt-1 text-sm text-gray-500"></p>
                    <div className="mt-3 flex space-x-7"></div>
                  </div>
                  <div className="ml-4 flex flex-shrink-0"></div>
                </div>
              )
            )}
          </ul>
        ) : (
          <p>{t("unread_notifications")}</p>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
