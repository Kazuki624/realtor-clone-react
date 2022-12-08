import { collection, doc, getDocs, limit, orderBy, query } from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import { Slider } from "../components/Slider";
import { Spinner } from "../components/Spinner";
import { db } from "../firebase";

export const Home = () => {
     const [listings, setListings] = useState(null);
     const [loading, setLoading] = useState(true);
     useEffect(() => {
          const fetchListings = async () => {
               const listingsRef = collection(db, "listings");
               const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5));
               const querySnap = await getDocs(q);
               let listings = [];
               querySnap.forEach((doc) => {
                    return listings.push({
                         id: doc.id,
                         data: doc.data(),
                    });
               });
               setListings(listings);
               setLoading(false);
          }
       fetchListings();
     }, []);
     if (loading) {
       return <Spinner />;
     }
     if (listings.length === 0) {
       return <></>;
     }
    return(
        <>
          <div>
               <Slider />
          </div>
        </>
    )
}