import { useSubscription } from "@apollo/client";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux/es/exports";
import { NEW_NOTIFICATION } from "../../utils/queries";
import { updateNotificationUnReaded } from "../../redux/authSlice";
import { toast } from "sonner";

const  NotificationSubscription = () => {
  const { token, user } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  if (user.id) {
    const { data } = useSubscription(NEW_NOTIFICATION, {
      variables: {
        userId: parseInt(user.id),
      },
      onData: (data: any) => {
        toast.success(data?.data?.data?.newInternalNotification.content);
        dispatch(
          updateNotificationUnReaded({
            notificationsUnReaded:
              data?.data?.data?.newInternalNotification?.notificationsCount,
          })
        );
      },
    });
  }

  return <></>
};

export default NotificationSubscription;
