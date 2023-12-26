const NotFound = ({ message }: { message: string }) => {
  return (
    <div className="flex h-96">
      <div className="flex mx-auto  text-center flex-col space-y-3">
        <img
          src="/assets/img/not_found.png"
          className="w-full mx-auto h-full object-cover"
          alt=""
        />
        <span className="text-subtitle mx-auto">{message}</span>
      </div>
    </div>
  );
};

export default NotFound;
