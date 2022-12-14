import { collection, doc, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react"
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { ListingItem } from "../components/ListingItem";
import { Spinner } from "../components/Spinner";
import { db } from "../firebase";

export const Category = () => {
     const [listings, setListings] = useState(null);
     const [loading, setLoading] = useState(true);
     const [lastFetchListing, setLastFetchListing] = useState(null);
     const params = useParams();
     useEffect(() => {
          const fetchListings = async() => {
               try {
                    const listingRef = collection(db, "listings");
                    const q = query(listingRef, where("type", "==", params.categoryName),orderBy("timestamp", "desc"), limit(8));
                    const querySnap = await getDocs(q);
                    const lastVisible = querySnap.docs[querySnap.docs.length -1];
                    setLastFetchListing(lastVisible);
                    const listings = [];
                    querySnap.forEach((doc) => {
                         return listings.push({
                              id : doc.id,
                              data : doc.data()
                         })
                    })
                    setListings(listings)
                    setLoading(false)
               } catch (error) {
                    toast.error("cannot get the information")
               }
          }
          fetchListings()
     },[params.categoryName])

     const onFetchMoreListings = async() => {
          try {
               const listingRef = collection(db, "listings");
               const q = query(listingRef, where("type", "==", params.categoryName),orderBy("timestamp", "desc"), limit(4),startAfter(lastFetchListing));
               const querySnap = await getDocs(q);
               const lastVisible = querySnap.docs[querySnap.docs.length -1];
               setLastFetchListing(lastVisible);
               const listings = [];
               querySnap.forEach((doc) => {
                    return listings.push({
                         id : doc.id,
                         data : doc.data()
                    })
               })
               setListings((prevState) => [...prevState,...listings])
               setLoading(false)
          } catch (error) {
               toast.error("cannot get the information")
          }
     }
    return(
        <div className="max-w-6xl mx-auto px-3 mb-6">
               <h1 className="text-3xl text-center mt-6 font-bold">
                    {params.categoryName === "rent" ? "Place for rent" : "Place for sale"}
               </h1>
               {loading ? (
                    <Spinner />
               ) : listings && listings.length > 0 ? (
                    <>
                         <main>
                              <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                              {listings.map((listing) => (
                                   <ListingItem
                                        key={listing.id}
                                        id={listing.id}
                                        listing={listing.data}
                         />
              ))}
            </ul>
          </main>
          {lastFetchListing && (
               <div className="flex justify-center items-center">
                    <button className="bg-white px-3 py-1.5 text-gray-700 border border-gray-300 mb-6 mt-6 hover:border-gray-600 transition rounded duration-150 ease-out"
                              onClick={onFetchMoreListings}>
                         See more
                    </button>
               </div>
          )}
                    </>
               ) : (
                    <p>There are no current {params.categoryName === "rent" ? "places for rent" : "places for sale"}</p>
               )}
        </div>
    )
}