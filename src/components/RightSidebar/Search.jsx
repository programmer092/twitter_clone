import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { StateContext } from "../../context/stateContext";

export default function Search() {
  const [search, setsearch] = useState("");
  const [users, setUsers] = useState([]);
  const { setactive, setID, setprofilecomp } = StateContext();

  useEffect(() => {
    const fetchInputUsers = async () => {
      if (search.trim() === "") {
        setUsers([]);
        return;
      }

      const q = query(
        collection(db, "Users"),
        where("name", ">=", search),
        where("name", "<=", search + "\uf8ff"),
      );

      const Data = await getDocs(q);
      const userlist = Data.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      setUsers(userlist);
    };

    fetchInputUsers();
  }, [search]);

  const handleOtherUserProfile = async (id) => {
    setID(id);
    setprofilecomp("posts");
    setactive("othersprofile");
    setsearch("");
  };

  return (
    <>
      <div className="sticky top-0 z-10 rounded-lg bg-gray-900 p-3">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setsearch(e.target.value)}
          className="w-full rounded-lg border border-gray-700 bg-gray-800 p-2 pl-10 text-white focus:border-blue-500 focus:outline-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 -6 40 40' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M8 4a6 6 0 016 6m-6 6a6 6 0 110-12 6 6 0 010 12zm13 5-5-5'/%3E%3C/svg%3E")`,
            backgroundPosition: "10px center",
            backgroundRepeat: "no-repeat",
          }}
        />
        {search && users.length > 0 && (
          <ul className="mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-700 bg-gray-800 text-white">
            {users.map((user, index) => (
              <li key={index} className="cursor-pointer p-2 hover:bg-gray-700">
                <div
                  className="mb-1 flex items-center"
                  onClick={() => handleOtherUserProfile(user.id)}
                >
                  <img
                    src={user.profileImage}
                    alt="Avatar"
                    className="h-12 w-12 rounded-full"
                  />
                  <div className="ml-2">
                    <span className="block font-bold text-white">
                      {user.name}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
