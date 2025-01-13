'use client'
import axios from 'axios'
import React, { useState } from 'react'

interface PaymentStatusProps {
  orderEmail: string
  orderId: string
  isPaid: boolean
}

const PaymentStatus = ({
  orderEmail,
  orderId,
  isPaid,
}: PaymentStatusProps) => {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId }),
    })

    const session = await response.data
    if (session.url) {
      window.location.href = session.url
    }
    setLoading(false)
  }

  return (
    <div className='mt-16 grid grid-cols-2 gap-x-4 text-sm text-gray-600'>
      <div>
        <p className='font-medium text-gray-900'>
          Shipping To
        </p>
        <p>{orderEmail}</p>
      </div>

      <div>
        <p className='font-medium text-gray-900'>
          Order Status
        </p>
        <p>
          {isPaid
            ? 'Payment successful'
            : 'Pending payment'}
        </p>
        {!isPaid && (
          <button
            onClick={handleCheckout}
            disabled={loading}
            className='mt-2 bg-blue-500 text-white p-2 rounded'
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        )}
      </div>
    </div>
  )
}

export default PaymentStatus