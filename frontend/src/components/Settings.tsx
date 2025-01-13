'use client'
import { Button } from './ui/button'
import { IUser } from '../schema/user'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Spinner from './Spinner'

const UserProfile = ({ user }: { user: IUser | null }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [deliveryLocation, setDeliveryLocation] = useState(user?.deliveryLocation || '');
  const [customLocation, setCustomLocation] = useState(user?.customLocation || '');

  const userId = user?.supertokens_id;

  // Fetch user data on component mount
  useEffect(() => {
    const abortController = new AbortController(); // Create an AbortController instance
    const fetchUserData = async () => {
      if (userId) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/user/${userId}`);
          setFirstName(response.data.firstName);
          setLastName(response.data.lastName);
          setDeliveryLocation(response.data.deliveryLocation);
          setCustomLocation(response.data.customLocation);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();

    return () => {
      abortController.abort(); // Cleanup function to abort the request
    };
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Custom Location before submit:', customLocation);
    const requestData = {
      firstName: firstName,
      lastName: lastName,
      deliveryLocation: deliveryLocation,
      customLocation: (deliveryLocation === 'Off campus residence' || deliveryLocation === 'Dorm Room') ? customLocation : '',
    };
    console.log('Request Data:', requestData);
    const sessionToken = localStorage.getItem('sessionToken'); // Adjust as necessary
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/settings`, requestData, {
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
        },
      });
      console.log('Profile updated successfully:', response.data);
      window.location.reload();
      // Update the local state with the new user data
      setFirstName(response.data.firstName);
      setLastName(response.data.lastName);
      setDeliveryLocation(response.data.deliveryLocation);
      setCustomLocation(response.data.customLocation);
      
      setIsEditing(false); // Optionally close the editing mode
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  }

  if (!user) return <div><Spinner/></div>
  
  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Account Profile</h1>
      
      <div className="space-y-4">
        <div>
          <label className="font-semibold">Email:</label>
          <p>{user.email}</p>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <>
              <div>
                <label className="font-semibold">First Name:</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="font-semibold">Last Name:</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="font-semibold">Delivery Location:</label>
                <select
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select a location</option>
                  <option value="Off campus residence">Off campus residence</option>
                  <option value="Rodin Office">Rodin Office</option>
                  <option value="Harrison Office">Harrison Office</option>
                  <option value="Harnwell Office">Harnwell Office</option>
                  <option value="Dorm Room">Dorm Room</option>
                  <option value="Hill Office">Hill Office</option>
                  <option value="Lauder Office">Lauder Office</option>
                  <option value="Guttman Office">Guttman Office</option>
                </select>
              </div>
              {(deliveryLocation === 'Off campus residence' || deliveryLocation === 'Dorm Room') && (
                <div>
                  <label className="font-semibold">
                    {deliveryLocation === 'Dorm Room' ? 'Dorm Room' : `${deliveryLocation} Address`}:
                  </label>
                  <input
                    type="text"
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              )}
            </>
            <Button type="submit" variant="bigpurple">Save Changes</Button>
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
          </form>
        ) : (
          <>
            <div>
              <label className="font-semibold">First Name:</label>
              <p>{user.firstName || 'Not set'}</p>
            </div>
            <div>
              <label className="font-semibold">Last Name:</label>
              <p>{user.lastName || 'Not set'}</p>
            </div>
            <div>
              <label className="font-semibold">Delivery Location:</label>
              <p>{user.deliveryLocation || 'Not set'}</p>
              {(user.deliveryLocation === 'Off campus residence' || user.deliveryLocation === 'Dorm Room') && (
                <p>{user.customLocation || 'Not set'}</p>
              )}
            </div>
            <Button variant="bigpurple" onClick={() => setIsEditing(true)}>Edit Profile</Button>
          </>
        )}
      </div>
    </div>
  )
}

export default UserProfile
