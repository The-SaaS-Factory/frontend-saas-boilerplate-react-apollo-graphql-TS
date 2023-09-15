 
const UserCard = ({user}) => {
  return (
    <div>
      <div className="flex flex-col">
        <div className="flex items-center space-x-2">
          <img
            className="avatar"
            src={user.avatar ?? "/assets/img/avatar.png"}
            alt=""
          />
          <div className="flex  flex-col">
            <span className="mr-auto text">
              {user.name} ({user.id})
            </span>
            <span className="text-secundary mr-auto">{user.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
