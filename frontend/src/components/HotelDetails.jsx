import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShimmerFeaturedGallery } from "react-shimmer-effects";
import '../App.css';
import NavbarDesktop from './NavbarDesktop'
import ImageGallary from './ImageGallary'
import CheckAvailability from './CheckAvailability'
import Rooms from './Room'
import OfferSection from './OfferSection'
import Calander from './Calander'
import Review from './Review'
import MapContainer from './MapContainer'
import HostProfile from './HostProfile'

function HotelDetails() {
  const [hotel, setHotel] = useState(null);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { slug } = useParams();

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 5000));
        const hotelResponse = await fetch(`http://localhost:8000/hotel/${slug}`);
        const roomsResponse = await fetch(`http://localhost:8000/hotel/${slug}/rooms`);
        
        if (!hotelResponse.ok || !roomsResponse.ok) {
          throw new Error('Network response was not ok');
        }
        
        const hotelData = await hotelResponse.json();
        const roomsData = await roomsResponse.json();
        
        setHotel(hotelData.info);
        setRoom(roomsData);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchHotelData();
  }, [slug]);

  if (loading) {
    return (
      <div>
        <NavbarDesktop />
        <ShimmerFeaturedGallery />
        <ShimmerFeaturedGallery />
        <ShimmerFeaturedGallery />
      </div>
    );
  }

  if (error) return <div>{error}</div>;
  if (!hotel || !room) return <div>No data found</div>;

  return (
    <div>
      <NavbarDesktop/>
      <ImageGallary 
        imagesUrl={hotel.images}
        title={hotel.title}
      />
      <CheckAvailability 
        guestCount={hotel.guest_count} 
        bedroomCount={hotel.bedroom_count} 
        bathroomCount={hotel.bathroom_count}
        name={hotel.host_name}
        image={hotel.host_image}
        bedroom={hotel.bedroom_count}
        bathroom={hotel.bathroom_count}
        guest={hotel.guest_count}
      />
      <Rooms
        room={room}
        hotelSlug={slug}      
      />
      <OfferSection amenities={hotel.amenities}/>
      <Calander/>
      <Review/>
      <MapContainer 
        latitude={hotel.latitude} 
        longitude={hotel.longitude}
      />
      <HostProfile 
        name={hotel.host_name} 
        image={hotel.host_image} 
        email={hotel.host_email} 
        phone={hotel.host_phone}
      />
    </div>
  );
}

export default HotelDetails;