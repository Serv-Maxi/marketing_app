import { ListCreation } from "../custom/list-creation";

export const RecentCreation = () => {
  return (
    <div className="grid grid-cols-1 gap-[16px] mt-[12px]">
      {[...Array(5)].map((_, index) => (
        <ListCreation key={index} />
      ))}
    </div>
  );
};
