"use client"
import React, { Suspense } from 'react'
import CheckoutSummary from '@/components/CheckoutSummary'

const SuccessPaymentPage = () => {
  return (
    <Suspense fallback={<div className="flex justify-center items-center py-8">Loading...</div>}>
      <CheckoutSummary />
    </Suspense>
  )
}

export default SuccessPaymentPage