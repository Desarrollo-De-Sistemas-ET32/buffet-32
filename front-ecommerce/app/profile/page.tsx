import React from 'react'
import PageContainer from '../../components/PageContainer'
import ProfileComponent from '@/components/profile/ProfileComponent'

const page = () => {
  return (
    <PageContainer showHeader>
      <ProfileComponent />
    </PageContainer>
  )
}

export default page