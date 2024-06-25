
import useGetNotifications from "../../hooks/useGetNotifications";

export default function Notifications() {
  const { notification } = useGetNotifications();
  return (
    <>
     
      <div className="h-full w-full">
        <div className="flex flex-col overflow-y-auto">
          {notification.length > 0 ? (
            notification.map((alerts, index) => (
              <div key={index}>
                <div className="m-2 flex flex-row space-x-1 space-y-1 border-b-2 border-gray-900">
                  <img
                    src={
                      alerts.user?.profileImage ||
                      "https://via.placeholder.com/48"
                    }
                    alt="Avatar"
                    className="h-10 w-10 rounded-full sm:h-12 sm:w-12"
                  />
                  <div className="ml-2 flex-1 text-white sm:ml-4">
                    <div className="flex flex-col">
                      <div className="flex flex-row">
                        <span className="text-sm font-bold sm:text-lg">
                          {alerts.user.name}
                        </span>
                        {alerts.user.username && (
                          <span className="ml-2 text-sm text-gray-500 sm:text-lg">
                            @{alerts.user.username}
                          </span>
                        )}
                        <span className="ml-2 text-sm text-gray-500 sm:text-lg">
                          {alerts.formattedTime}
                        </span>
                      </div>
                      <div className="mt-2 text-sm sm:text-lg">
                        {alerts.message}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center">
              No notifications..
            </div>
          )}
        </div>
      </div>
    </>
  );
}
