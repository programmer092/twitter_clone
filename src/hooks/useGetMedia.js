import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import toast from "react-hot-toast";
import { StateContext } from "../context/stateContext";

const useGetMedia = () => {
  const { ID } = StateContext();
  const [medias, setmedias] = useState([]);
  const [loading, setloading] = useState(true);
  useEffect(() => {
    const getMedia = async () => {
      const mediaRef = doc(db, "Medias", ID);
      const mediaData = await getDoc(mediaRef);
      setloading(true);
      try {
        if (mediaData.exists()) {
          const media = mediaData.data().files;
          setmedias(media);
          setloading(false);
        }
      } catch (error) {
        toast.error(error.message);
        setmedias([]);
        setloading(false);
      }
    };
    getMedia();
  }, [ID]);

  return { loading, medias };
};

export default useGetMedia;
